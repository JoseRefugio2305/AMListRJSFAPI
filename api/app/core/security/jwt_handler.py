from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

# from app.core.logger import get_logger
from app.core.config import settings

# leg = get_logger(__name__)

# Creamos el schema del OAuth2, dandole como parametro la ruta en la que se otorgan los tokens al usuario despues de iniciar sesion
# Con el parametro auto_error damos la posibilidad a una autenticacion opcional, esto nos funcionara para rutas en las que no es necesario estar autenticado
# OAuth2PasswordBearer por defecto exige un bearer token, de no poder obtenerlo lanza una excepcion de falta de autenticacion
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


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
