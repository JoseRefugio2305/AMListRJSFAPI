from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    status,
    BackgroundTasks,
)

from app.core.tasks.task_manager import task_manager
from app.services.anime import (
    AnimeService,
    AnimeJikanService,
    AnimeFileService,
    AnimeCRUDService,
)
from app.services.shared import GenreService
from app.core.security import require_admin
from app.core.utils import ObjectIdStr
from app.schemas.common.responses import ResponseUpdCrt
from app.schemas.anime import (
    AnimeCreateSchema,
    AnimeUpdateSchema,
    PayloadAnimeIDMAL,
    ResponseUpdAllMALSchema,
)
from app.schemas.search import (
    PayloadSearchAnimeMAL,
    ResponseSearchAnimeMAL,
    SearchAnimeIncompleteSchema,
    FilterSchema,
    ReadyToMALEnum,
    FilterGSAESchema,
    SearchGenresSchema,
    SearchStudiosSchema,
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
    response_model=ResponseUpdCrt,
    status_code=status.HTTP_201_CREATED,
)
async def create(
    payload: AnimeCreateSchema,
):
    logger.debug(payload)
    response = await AnimeCRUDService.create_anime(payload)
    return response.model_dump()


# Actualizacion del anime
@routerDashAnime.put("/update/{anime_id}", response_model=ResponseUpdCrt)
async def update(
    anime_id: ObjectIdStr,
    payload: AnimeUpdateSchema = None,
):
    # SI no se recibe informacion para actualizar se lanza un error
    if payload is None:
        raise HTTPException(
            status_code=400, detail="No se proporcionaron datos para actualizar"
        )
    response = await AnimeCRUDService.update_anime(anime_id, payload)
    return response.model_dump()


# Eliminar anime
@routerDashAnime.delete("/delete/{anime_id}", response_model=ResponseUpdCrt)
async def delete(
    anime_id: ObjectIdStr,
):
    response = await AnimeCRUDService.delete_anime(anime_id)
    return response.model_dump()


# Buscar anime en MAL por su titulo
@routerDashAnime.post("/search_on_mal/", response_model=ResponseSearchAnimeMAL)
async def search_mal(
    payload: PayloadSearchAnimeMAL,
):
    listAnimes = await AnimeJikanService.search_anime_mal(payload)
    return listAnimes.model_dump()


# Asignar un ID MAL  a un anime
@routerDashAnime.post("/assign_id_mal/", response_model=ResponseUpdCrt)
async def assign_id_mal(
    payload: PayloadAnimeIDMAL,
):
    response = await AnimeJikanService.assign_id_mal_anime(payload)
    return response.model_dump()


# Actualizar un anime con su informacion desde MAL
@routerDashAnime.get(
    "/update_from_mal/{anime_id}",
)
async def update_from_mal(anime_id: ObjectIdStr, backTasks: BackgroundTasks):
    task_id = task_manager.create_task(
        f"Actualización a MAL del anime con ID {anime_id}", 0
    )
    backTasks.add_task(AnimeJikanService.run_update_anime_mal_back, task_id, anime_id)
    return {
        "message": "Actualización de anime iniciada en background.",
        "task_id": task_id,
    }


# Actualizar todos los animes que esten incompletos con su informacion desde MAL
@routerDashAnime.get("/update_all_to_mal/")
async def update_all_from_mal(backTasks: BackgroundTasks):

    task_id = task_manager.create_task("Actualización masiva de animes a MAL", 0)

    backTasks.add_task(AnimeJikanService.update_all_animes_from_mal_back, task_id)
    return {
        "message": "Actualización masiva iniciada en segundo plano.",
        "task_id": task_id,
    }


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
@routerDashAnime.post("/upload_file/", response_model=ResponseUpdAllMALSchema)
async def upload_file(file: UploadFile = File(...)):
    response = await AnimeFileService.insert_from_file(file)
    return response.model_dump()


# Busqueda y filtrado de generos
@routerDashAnime.post("/genres_list/", response_model=SearchGenresSchema)
async def get_genres(payload: FilterGSAESchema):
    response = await GenreService.genres_list(payload)
    return response.model_dump()


@routerDashAnime.post("/studios_list/", response_model=SearchStudiosSchema)
async def get_studios(payload: FilterGSAESchema):
    response = await AnimeService.studios_list(payload)
    return response.model_dump()
