from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.schemas.auth import UserLogRespSchema
from app.core.logging import get_logger

logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerUser = APIRouter(prefix="/user", tags=["user"])

#Obtener informacion de perfil
@routerUser.get("/", response_model=UserLogRespSchema)
async def me(user: UserLogRespSchema = Depends(get_current_user)):
    user.access_token = ""
    return user

#Obtencion de estadisticas del usuario
@routerUser.get("/stats/")
async def estadisticas():
    return {}
