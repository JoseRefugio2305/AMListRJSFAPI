from fastapi import APIRouter, Depends

from app.core.security import optional_current_user
from app.core.logger import get_logger
from app.schemas.filters_schema import FilterSchema, TipoContenidoEnum
from app.schemas.auth_schema import UserLogRespSchema
from app.schemas.search_schemas import (
    SearchAllSchema,
    AnimeSearchSchema,
    MangaSearchSchema,
)
from app.services.manga_service import MangaService
from app.services.anime_service import AnimeService

logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerSearch = APIRouter(prefix="/search", tags=["search"])


# Ruta para recibir peticiones de busqueda con filtros mas completos
@routerSearch.post("/", response_model=SearchAllSchema)
async def do_search(
    filters: FilterSchema, user: UserLogRespSchema = Depends(optional_current_user)
):
    ##Primero evaluamos si por los filtros indica que quiere hacer busqueda de anime o manga

    resultsAnimes = (
        await AnimeService.get_all(filters, user)
        if (
            filters.tipoContenido == TipoContenidoEnum.todos
            or filters.tipoContenido == TipoContenidoEnum.anime
        )
        else AnimeSearchSchema(listaAnimes=[], totalAnimes=0)
    )
    resultsMangas = (
        await MangaService.get_all(filters, user)
        if (
            filters.tipoContenido == TipoContenidoEnum.todos
            or filters.tipoContenido == TipoContenidoEnum.manga
        )
        else MangaSearchSchema(listaMangas=[], totalMangas=0)
    )
    return SearchAllSchema(
        listaAnimes=resultsAnimes.listaAnimes,
        totalAnimes=resultsAnimes.totalAnimes,
        listaMangas=resultsMangas.listaMangas,
        totalMangas=resultsMangas.totalMangas,
    )
