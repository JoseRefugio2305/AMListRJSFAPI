from fastapi import APIRouter, Depends
from typing import List

from app.core.security import get_current_user, optional_current_user
from app.core.logger import get_logger
from app.schemas.filters_schema import FilterSchema, EmisionFilterEnum
from app.schemas.auth_schema import UserLogRespSchema
from app.schemas.manga_schema import MangaSchema, MangaFavPayloadSchema
from app.schemas.anime_schema import AniFavRespSchema
from app.services.manga_service import MangaService

logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerManga = APIRouter(prefix="/manga", tags=["manga"])


# Listado general de mangas, paginado
@routerManga.post("/", response_model=List[MangaSchema])
async def manga_page(
    filters: FilterSchema, user: UserLogRespSchema = Depends(optional_current_user)
):
    mangas = await MangaService.get_all(filters, user)
    return [m.model_dump() for m in mangas]


# Mangas en publicacion
@routerManga.post("/publicando/", response_model=List[MangaSchema])
async def mangas_publicando(
    filters: FilterSchema, user: UserLogRespSchema = Depends(optional_current_user)
):
    filters.emision = EmisionFilterEnum.emision
    mangas_pub = await MangaService.get_all(filters, user)

    return [mp.model_dump() for mp in mangas_pub]


# Detalles de manga
@routerManga.get("/{key_manga}", response_model=MangaSchema)
async def manga_details(
    key_manga: int, user: UserLogRespSchema = Depends(optional_current_user)
):
    manga = await MangaService.get_manga_by_id(key_manga, user)
    return manga.model_dump()

# Ruta para agregar o quitar manga de favoritos
# Autenticacion no es opcional, es requerida
@routerManga.post("/changeFavStatus", response_model=AniFavRespSchema)
async def change_status_fav(
    payload: MangaFavPayloadSchema, user: UserLogRespSchema = Depends(get_current_user)
):
    response = await MangaService.change_status_favs(payload, user)
    return response.model_dump()