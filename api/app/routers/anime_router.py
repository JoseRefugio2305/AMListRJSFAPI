from fastapi import APIRouter, Depends

from app.core.security import get_current_user, optional_current_user
from app.services.anime_service import AnimeService
from app.schemas.filters_schema import FilterSchema, EmisionFilterEnum
from app.schemas.anime_schema import AnimeSchema, AniFavPayloadSchema, AniFavRespSchema
from app.schemas.search_schemas import AnimeSearchSchema
from app.schemas.auth_schema import UserLogRespSchema
from app.core.logger import get_logger

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


# @routerAnime.get()


# @routerAnime.get("/me")
# async def me(user: UserLogRespSchema = Depends(get_current_user)):
#     return user


# @routerAnime.get("/admin-only")
# async def admin_stats(user: UserLogRespSchema = Depends(require_admin)):
#     return {"message": "solo admin", "user": user}


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
    data = await AnimeService.change_status_favs(payload, user)
    return data.model_dump()
