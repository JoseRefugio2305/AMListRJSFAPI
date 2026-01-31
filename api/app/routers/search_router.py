from fastapi import APIRouter, Depends
import asyncio

from app.core.security import optional_current_user
from app.core.logging import get_logger
from app.schemas.search import (
    FilterSchema,
    TipoContenidoEnum,
    SearchAllSchema,
    AnimeSearchSchema,
    MangaSearchSchema,
    FiltersListAdvancedSearch,
)
from app.schemas.auth import UserLogRespSchema
from app.services.search_service import SearchService
from app.services.manga import MangaService
from app.services.anime import AnimeService

logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerSearch = APIRouter(prefix="/search", tags=["search"])

# asyncio.gather debe recibir coroutinas de ahi que se extraiga la logica a funciones que son coroutinas
# de no hacerse esto generaba errores cuando solo se queria hacer buscqueda de animes o mangas
async def _get_animes(filters: FilterSchema, user: UserLogRespSchema):
    if (filters.tipoContenido == TipoContenidoEnum.todos 
        or filters.tipoContenido == TipoContenidoEnum.anime):
        return await AnimeService.get_all(filters, user)
    return AnimeSearchSchema(listaAnimes=[], totalAnimes=0)


async def _get_mangas(filters: FilterSchema, user: UserLogRespSchema):
    if (filters.tipoContenido == TipoContenidoEnum.todos 
        or filters.tipoContenido == TipoContenidoEnum.manga):
        return await MangaService.get_all(filters, user)
    return MangaSearchSchema(listaMangas=[], totalMangas=0)


# Ruta para recibir peticiones de busqueda con filtros mas completos
@routerSearch.post("/", response_model=SearchAllSchema)
async def do_search(
    filters: FilterSchema, user: UserLogRespSchema = Depends(optional_current_user)
):
    ##Primero evaluamos si por los filtros indica que quiere hacer busqueda de anime o manga

    resultsAnimes, resultsMangas = await asyncio.gather(
        _get_animes(filters, user),
        _get_mangas(filters, user),
        return_exceptions=True
    )
    
    # Manejar excepciones
    if isinstance(resultsAnimes, Exception):
        logger.error(f"Error en búsqueda de animes: {resultsAnimes}")
        resultsAnimes = AnimeSearchSchema(listaAnimes=[], totalAnimes=0)
    if isinstance(resultsMangas, Exception):
        logger.error(f"Error en búsqueda de mangas: {resultsMangas}")
        resultsMangas = MangaSearchSchema(listaMangas=[], totalMangas=0)
    
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


# Obtener los generos, autores, estudios de animacion y editoriales de manga para los filtros en la busqueda
@routerSearch.get("/get_filters/", response_model=FiltersListAdvancedSearch)
async def get_filters():
    data = await SearchService.get_filters()
    return data.model_dump()
