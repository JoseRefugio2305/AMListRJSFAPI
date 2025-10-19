from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

# from app.core.logger import get_logger
from app.core.config import settings
from app.models.user_model import UserModel
from app.schemas.auth_schema import UserLogRespSchema
from app.core.utils import object_id_to_str

# leg = get_logger(__name__)

# Creamos el schema del OAuth2, dandole como parametro la ruta en la que se otorgan los tokens al usuario despues de iniciar sesion
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# Informacion del token, forma de identificarlo y expiracion
class TokenData(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None


# Crear token de acceso
def create_access_token(subject: str, minutes: Optional[int] = None) -> str:
    now = datetime.now(timezone.utc)
    # Para la expiracion, si no se recibe un dato especifico se usa el tiempo por defecto en las configuraciones
    exp = now + timedelta(minutes=(minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES))

    payload = {
        "sub": str(subject),
        "iat": int(now.timestamp()),
        "exp": int(exp.timestamp()),
    }

    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    return token


# Verificar el token
# Se decodifica y valida. Si es invalido lanza una excepcion y si es valido retorna la informacion
def verify_access_token(token: str) -> TokenData:
    try:
        # Obtenemos el payload del token
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        # Creamos el objeto de la data del token y lo retornamos
        token_data = TokenData(sub=payload.get("sub"), exp=payload.get("exp"))
        return token_data
    except jwt.ExpiredSignatureError:  # En caso de que se el token haya expirado
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token Expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:  # En caso de que el token sea invalido
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Obtener la informacion del usuario a partir del token dado
# Retorna un dict del usuario o una excepcion si el token no es valido
async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserLogRespSchema:
    token_data = verify_access_token(token)
    if not token_data.sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )
    # Buscamos al usuario usando el identificador del token, que es email
    user = object_id_to_str(await UserModel.find_by_email(token_data.sub))
    if not user:  # Si no lo encuentra lanzamos excepcion
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado"
        )
    return UserLogRespSchema(
        id=user.get("_id") or user.get("id") or user.get("Id"),
        name=user.get("name"),
        email=user.get("email"),
        rol=user.get("rol", 0),
        profile_pic=user.get("profile_pic"),
        created_date=user.get("created_date"),
        show_statistics=user.get("show_statistics"),
        access_token=token,
    )


# Verificar si quien realiza la peticion esta loggeado con un token valido
# Esta funcion nos servira para rutas y funciones en las que la autenticacion es opcional, a diferencia de get_currrent_user donde si es obligatoria, sino retorna una excepcion, a diferencia de esta
async def optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
) -> Optional[UserLogRespSchema]:
    # Si no hay token no esta autenticado
    if not token:
        return None

    try:
        token_data = verify_access_token(token)
        if not token_data.sub:
            return None
        user = object_id_to_str(await UserModel.find_by_email(token_data.sub))
        if not user:
            return None
        return UserLogRespSchema(
            id=user.get("_id") or user.get("id") or user.get("Id"),
            name=user.get("name"),
            email=user.get("email"),
            rol=user.get("rol", 0),
            profile_pic=user.get("profile_pic"),
            created_date=user.get("created_date"),
            show_statistics=user.get("show_statistics"),
            access_token=token,
        )
    except:
        return None


# Verificar si el usario es administrador si lo requiere un endpoint
def require_admin(
    user: UserLogRespSchema = (Depends(get_current_user)),
) -> UserLogRespSchema:
    rol = int(user.rol | 0)
    if rol != 1:  # Rol 1 es para administradores, 0 para usuario normal
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Permiso denegado"
        )
    return user
