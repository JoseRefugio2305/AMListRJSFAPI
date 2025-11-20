from fastapi import APIRouter, Depends

from app.services.user_services import UserService
from app.core.security import require_admin
from app.schemas.auth import UserListSchema, PayloadActiveStateSchema
from app.schemas.search import UserListFilterSchema
from app.schemas.stats import TypeStatisticEnum, ConteoGeneralSchema
from app.services.stats_service import StatsService
from app.core.logging import get_logger


logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerDashboard = APIRouter(
    prefix="/dashboard", tags=["dashboard"], dependencies=[Depends(require_admin)]
)


# Obtener las estadisticas generales del sistema
@routerDashboard.get("/stats/", response_model=ConteoGeneralSchema)
async def estadisticas(tipoStats: TypeStatisticEnum = TypeStatisticEnum.a_m_favs,):
    # Si queremos el conteo general
    if tipoStats == TypeStatisticEnum.a_m_favs:
        conteosGenerales = await StatsService.get_general_count()
        return conteosGenerales.model_dump()
    else:  # Si queremos alguna otra estadistica
        stats = await StatsService.get_stats(False, None, tipoStats)
        return stats.model_dump()


# Obtener la lista de usuarios de acuerdo a los filtros dados
@routerDashboard.post("/users_list/", response_model=UserListSchema)
async def users_list(userFilters: UserListFilterSchema,):
    userList = await UserService.get_users_list(userFilters)

    return userList.model_dump()


# Cambiar el estadod e activo de un usuario especifico
@routerDashboard.post("/cng_active_state/", response_model=PayloadActiveStateSchema)
async def cng_active_state( payload: PayloadActiveStateSchema,):

    response = await UserService.change_active_state(payload)

    return response.model_dump()
