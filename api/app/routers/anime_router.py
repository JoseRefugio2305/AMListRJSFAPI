from fastapi import APIRouter, Depends

from app.core.security import get_current_user, optional_current_user
from app.services.anime import AnimeService, AnimeCRUDService
from app.schemas.search import FilterSchema, EmisionFilterEnum, AnimeSearchSchema
from app.schemas.anime import AnimeSchema, AniFavPayloadSchema, AniFavRespSchema
from app.schemas.auth import UserLogRespSchema
from app.core.logging import get_logger

logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerAnime = APIRouter(prefix="/anime", tags=["anime"])


# Listado general de animes, paginado
@routerAnime.post("/", response_model=AnimeSearchSchema)
async def anime_page(
    filters: FilterSchema, user: UserLogRespSchema = Depends(optional_current_user)
):
    animes = await AnimeService.get_all(filters, user)

    return animes.model_dump()


# Animes en emision
@routerAnime.post("/emision/", response_model=AnimeSearchSchema)
async def animes_emision(
    filters: FilterSchema, user: UserLogRespSchema = Depends(optional_current_user)
):
    filters.emision = EmisionFilterEnum.emision
    animes_emision = await AnimeService.get_all(filters, user)

    return animes_emision.model_dump()


# Detalles de anime
@routerAnime.get("/{key_anime}", response_model=AnimeSchema)
async def anime_details(
    key_anime: int, user: UserLogRespSchema = Depends(optional_current_user)
):
    anime = await AnimeService.get_anime_by_id(key_anime, user)
    return anime.model_dump()


# Ruta para agregar o quitar anime de favoritos
# Autenticacion no es opcional, es requerida
@routerAnime.post("/changeFavStatus", response_model=AniFavRespSchema)
async def change_status_fav(
    payload: AniFavPayloadSchema, user: UserLogRespSchema = Depends(get_current_user)
):
    data = await AnimeCRUDService.change_status_favs(payload, user)
    return data.model_dump()
