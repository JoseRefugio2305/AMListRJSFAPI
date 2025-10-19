from fastapi import APIRouter, HTTPException, status

from app.schemas.auth_schema import UserRegLogSchema, UserLogRespSchema
from app.services.auth_service import register_user, auth_user
from app.core.security import create_access_token
from app.core.logger import get_logger

# Creamos el router con el prefijo y la tag de la documentacion
routerAuth = APIRouter(prefix="/auth", tags=["auth"])

log = get_logger(__name__)


# Ruta de registro
@routerAuth.post(
    "/register", response_model=UserLogRespSchema, status_code=status.HTTP_201_CREATED
)
async def register(payload: UserRegLogSchema):
    try:
        # Registramos usuario
        created = await register_user(payload.name, payload.email, payload.password)
    except ValueError as e:
        # Error
        raise HTTPException(status_code=400, detail=str(e))
    return created.model_dump()


# Ruta de inicio de sesion
@routerAuth.post("/login", response_model=UserLogRespSchema)
async def login(payload: UserRegLogSchema):
    # Revisamos si el usuario existe y que sus credenciales sean correctas
    user = await auth_user(payload.email, payload.password)
    if not user:  # Si no es asi, retornamos el error
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos ",
        )
    # user = object_id_to_str(user)
    accessToken = create_access_token(subject=str(user.email))
    user.access_token = accessToken
    return user.model_dump()
