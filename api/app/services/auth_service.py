from typing import Optional
from passlib.context import CryptContext

from app.models.user_model import UserModel
from app.schemas.auth import UserRegSchema, UserLogRespSchema, RolEnum
from app.schemas.search import ActiveUserEnum
from app.core.utils import (
    object_id_to_str,
    str_trim_lower,
    time_now_formatted,
    dict_to_user_schema,
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
    isExists = await UserModel.find_by_email(email=email, username=name)
    if isExists:  # Si existe marcamos el error
        msg = ""
        if str_trim_lower(isExists.get("email")) == str_trim_lower(email):
            log.warning(f"El ususario {email} ya existe {isExists.get("email")}")
            msg = "Email"
        elif str_trim_lower(isExists.get("name")) == str_trim_lower(name):
            log.warning(f"El ususario {name} ya existe {isExists.get("name")}")
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

    insertedId = await UserModel.insert_one(dataNU.model_dump())  # Insertamos
    log.info(f"Usuario registrado: {insertedId}")

    createdUser = object_id_to_str(
        await UserModel.find_by_email(email=email)
    )  # Obtenemos la informacion del usuario registrado y hacemos la conversion a str del objectid

    accessToken = create_access_token(
        subject=createdUser.get("email")
    )  # Creamos el accesstoken usando el email como sujeto de de identificacion
    return dict_to_user_schema(createdUser, accessToken)


# Verificamos que las credenciales sean correctas
async def auth_user(email: str, password: str) -> Optional[UserLogRespSchema]:
    # Se revisa si el usuario existe y que su contrasena corresponda al hash, de no pasar alguna de las comprobaciones retorna none, si la pasa retorna la info del usuario
    user = object_id_to_str(
        await UserModel.find_by_email(email=email, tipoactive=ActiveUserEnum.activo)
    )
    if not user:
        return None
    hashed = user.get("password")
    if not hashed or not verify_pass(password, hashed):
        return None

    return dict_to_user_schema(user, "")
