from typing import Optional
from fastapi import Depends, HTTPException, status

from app.models.user_model import UserModel
from app.schemas.auth import UserLogRespSchema
from app.core.utils import object_id_to_str
from .jwt_handler import verify_access_token, oauth2_scheme

# leg = get_logger(__name__)


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
