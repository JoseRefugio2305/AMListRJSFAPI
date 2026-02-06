from typing import Optional
from passlib.context import CryptContext

from app.repositories.auth import AuthRepository
from app.models.user_model import UserModel
from app.schemas.auth import UserRegSchema, UserLogRespSchema, RolEnum
from app.schemas.search import ActiveUserEnum
from app.core.utils import (
    object_id_to_str,
    str_trim_lower,
    time_now_formatted,
)
from app.core.security import create_access_token
from app.core.logging import get_logger

log = get_logger(__name__)

# Creamos el xontexto para el hashing y verificacion de contrasenas, ademas de hacer que este preparada para verificar algoritmos deprecados
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


# Hashear contrasena
def get_pass_hash(password: str) -> str:
    return pwd_context.hash(password)


# Verificar contrasena
def verify_pass(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# egistrar usuario en BDD
async def register_user(name: str, email: str, password: str) -> UserLogRespSchema:
    # Revisamos si ya existe un usuario en BDD con ese email
    isExists = await AuthRepository.find_by_email(email=email, username=name)
    if isExists:  # Si existe marcamos el error
        msg = ""
        if str_trim_lower(isExists.email) == str_trim_lower(email):
            log.warning(f"El ususario {email} ya existe {isExists.email}")
            msg = "Email"
        elif str_trim_lower(isExists.name) == str_trim_lower(name):
            log.warning(f"El ususario {name} ya existe {isExists.name}")
            msg = "username"
        raise ValueError(f"Ya existe un usuario registrado con ese {msg}")
    hashedPass = get_pass_hash(password)
    nowTS = time_now_formatted(True)
    # Creamos el schema del usuario
    dataNU = UserRegSchema(
        name=name,
        email=email,
        password=hashedPass,
        rol=RolEnum.base_user,
        is_active=True,
        profile_pic=1,
        created_date=nowTS,
        show_statistics=0,
    )

    createdUser = await AuthRepository.insert_user(dataNU, email)

    # Creamos el accesstoken usando el email como sujeto de de identificacion
    accessToken = create_access_token(subject=createdUser.get("email"))
    return UserModel.to_user(createdUser.model_dump(), accessToken)


# Verificamos que las credenciales sean correctas
async def auth_user(email: str, password: str) -> Optional[UserLogRespSchema]:
    # Se revisa si el usuario existe y que su contrasena corresponda al hash, de no pasar alguna de las comprobaciones retorna none, si la pasa retorna la info del usuario
    user = object_id_to_str(
        await AuthRepository.find_by_email(
            email=email, tipoactive=ActiveUserEnum.activo
        )
    )
    if not user:
        return None
    hashed = user.get("password")
    if not hashed or not verify_pass(password, hashed):
        return None

    return UserModel.to_user(user, "")
