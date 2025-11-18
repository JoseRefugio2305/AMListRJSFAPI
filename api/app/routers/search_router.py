from fastapi import APIRouter, Depends

from app.core.security import optional_current_user
from app.core.logging import get_logger
from app.schemas.search import (
    FilterSchema,
    TipoContenidoEnum,
    SearchAllSchema,
    AnimeSearchSchema,
    MangaSearchSchema,
)
from app.schemas.auth import UserLogRespSchema
from app.services.manga import MangaService
from app.services.anime import AnimeService

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
        pageA=resultsAnimes.pageA,
        totalPagesA=resultsAnimes.totalPagesA,
        listaMangas=resultsMangas.listaMangas,
        totalMangas=resultsMangas.totalMangas,
        pageM=resultsMangas.pageM,
        totalPagesM=resultsMangas.totalPagesM,
    )
