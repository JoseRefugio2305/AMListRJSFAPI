from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status

from app.services.anime import AnimeService, AnimeJikanService, AnimeFileService
from app.core.security import require_admin
from app.core.utils import ObjectIdStr
from app.schemas.anime import (
    AnimeCreateSchema,
    ResponseUpdCrtAnime,
    AnimeUpdateSchema,
    PayloadAnimeIDMAL,
    ResponseUpdAllMALSchema,
    RespUpdMALAnimeSchema,
)
from app.schemas.search import (
    PayloadSearchAnimeMAL,
    ResponseSearchAnimeMAL,
    SearchAnimeIncompleteSchema,
    FilterSchema,
    ReadyToMALEnum,
)
from app.core.logging import get_logger

logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerDashAnime = APIRouter(
    prefix="/dashboard/anime", tags=["dashboard"], dependencies=[Depends(require_admin)]
)


# Creacion del anime
@routerDashAnime.post(
    "/create/",
    response_model=ResponseUpdCrtAnime,
    status_code=status.HTTP_201_CREATED,
)
async def create(
    payload: AnimeCreateSchema,
):
    logger.debug(payload)
    response = await AnimeService.create_anime(payload)
    return response.model_dump()


# Actualizacion del anime
@routerDashAnime.put("/update/{anime_id}", response_model=ResponseUpdCrtAnime)
async def update(
    anime_id: ObjectIdStr,
    payload: AnimeUpdateSchema = None,
):
    # SI no se recibe informacion para actualizar se lanza un error
    if payload is None:
        raise HTTPException(
            status_code=400, detail="No se proporcionaron datos para actualizar"
        )
    response = await AnimeService.update_anime(anime_id, payload)
    return response.model_dump()


# Eliminar anime
@routerDashAnime.delete("/delete/{anime_id}", response_model=ResponseUpdCrtAnime)
async def delete(
    anime_id: ObjectIdStr,
):
    response = await AnimeService.delete_anime(anime_id)
    return response.model_dump()


# Buscar anime en MAL por su titulo
@routerDashAnime.post("/search_on_mal/", response_model=ResponseSearchAnimeMAL)
async def search_mal(
    payload: PayloadSearchAnimeMAL,
):
    listAnimes = await AnimeJikanService.search_anime_mal(payload)
    return listAnimes.model_dump()


# Asignar un ID MAL  a un anime
@routerDashAnime.post("/assign_id_mal/", response_model=ResponseUpdCrtAnime)
async def assign_id_mal(
    payload: PayloadAnimeIDMAL,
):
    response = await AnimeJikanService.assign_id_mal_anime(payload)
    return response.model_dump()


# Actualizar un anime con su informacion desde MAL
@routerDashAnime.get(
    "/update_from_mal/{anime_id}", response_model=RespUpdMALAnimeSchema
)
async def update_from_mal(
    anime_id: ObjectIdStr,
):
    response = await AnimeJikanService.update_anime_from_mal(
        animeId=anime_id, is_all=False
    )
    return response.model_dump()


# Actualizar todos los animes que esten incompletos con su informacion desde MAL
@routerDashAnime.get("/update_all_to_mal/", response_model=ResponseUpdAllMALSchema)
async def update_all_from_mal():
    response = await AnimeJikanService.update_all_animes_from_mal()
    return response.model_dump()


# Obtener los animes que tienen la informacion incompleta (no hn sido actualizados a su informacion con MAL)
@routerDashAnime.post(
    "/get_incomplete/{ready_to_mal}", response_model=SearchAnimeIncompleteSchema
)
async def get_incomplete(
    ready_to_mal: ReadyToMALEnum,
    filters: FilterSchema,
):
    incompleteAnimes = await AnimeService.get_incomplete_animes(filters, ready_to_mal)

    return incompleteAnimes.model_dump()


# Subir archivo para insertar multiples animes
@routerDashAnime.post("/upload_file/")
async def upload_file(file: UploadFile = File(...)):
    response = await AnimeFileService.insert_from_file(file)
    return response
