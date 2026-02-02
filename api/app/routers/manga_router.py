from fastapi import APIRouter, Depends, Request

from app.core.security import get_current_user, optional_current_user
from app.core.logging import get_logger
from app.schemas.search import FilterSchema, EmisionFilterEnum, MangaSearchSchema
from app.schemas.auth import UserLogRespSchema
from app.schemas.manga import MangaSchema, MangaFavPayloadSchema
from app.schemas.anime import AniFavRespSchema
from app.services.manga import MangaService, MangaCRUDService
from app.core.security.rate_limiter import limiter

logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerManga = APIRouter(prefix="/manga", tags=["manga"])


# Listado general de mangas, paginado
@routerManga.post("/", response_model=MangaSearchSchema)
@limiter.limit("30/minute")
async def manga_page(
    request: Request,
    filters: FilterSchema,
    user: UserLogRespSchema = Depends(optional_current_user),
):
    mangas = await MangaService.get_all(filters, user)
    return mangas.model_dump()


# Mangas en publicacion
@routerManga.post("/publicando/", response_model=MangaSearchSchema)
@limiter.limit("30/minute")
async def mangas_publicando(
    request: Request,
    filters: FilterSchema,
    user: UserLogRespSchema = Depends(optional_current_user),
):
    filters.emision = EmisionFilterEnum.emision
    mangas_pub = await MangaService.get_all(filters, user)

    return mangas_pub.model_dump()


# Detalles de manga
@routerManga.get("/{key_manga}", response_model=MangaSchema)
async def manga_details(
    request: Request,
    key_manga: int,
    user: UserLogRespSchema = Depends(optional_current_user),
):
    manga = await MangaService.get_manga_by_id(key_manga, user)
    return manga.model_dump()


# Ruta para agregar o quitar manga de favoritos
# Autenticacion no es opcional, es requerida
@routerManga.post("/changeFavStatus", response_model=AniFavRespSchema)
async def change_status_fav(
    payload: MangaFavPayloadSchema, user: UserLogRespSchema = Depends(get_current_user)
):
    response = await MangaCRUDService.change_status_favs(payload, user)
    return response.model_dump()
