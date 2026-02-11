from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks

from app.core.tasks.task_manager import task_manager
from app.services.manga import MangaService, MangaJikanService, MangaCRUDService
from app.core.security import require_admin
from app.core.utils import ObjectIdStr
from app.schemas.common.responses import ResponseUpdCrt
from app.schemas.manga import (
    MangaCreateSchema,
    MangaUpdateSchema,
    PayloadMangaIDMAL,
)
from app.schemas.search import (
    PayloadSearchMangaMAL,
    ResponseSearchMangaMAL,
    SearchMangaIncompleteSchema,
    ReadyToMALEnum,
    FilterSchema,
    FilterGSAESchema,
    SearchEditorialsSchema,
    SearchAutoresSchema,
)

from app.core.logging import get_logger

logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerDashManga = APIRouter(
    prefix="/dashboard/manga", tags=["dashboard"], dependencies=[Depends(require_admin)]
)


# Ruta de creacion de manga
@routerDashManga.post(
    "/create/",
    response_model=ResponseUpdCrt,
    status_code=status.HTTP_201_CREATED,
)
async def create(payload: MangaCreateSchema):
    response = await MangaCRUDService.create_manga(payload)
    return response.model_dump()


# Ruta para actualizar manga
@routerDashManga.put("/update/{manga_id}", response_model=ResponseUpdCrt)
async def update(
    manga_id: ObjectIdStr,
    payload: MangaUpdateSchema = None,
):
    # SI no se recibe informacion para actualizar se lanza un error
    if payload is None:
        raise HTTPException(
            status_code=400, detail="No se proporcionaron datos para actualizar"
        )
    response = await MangaCRUDService.update_manga(payload=payload, manga_id=manga_id)
    return response.model_dump()


# Eliminar manga
@routerDashManga.delete("/delete/{manga_id}", response_model=ResponseUpdCrt)
async def delete(manga_id: ObjectIdStr):

    response = await MangaCRUDService.delete_manga(manga_id)

    return response.model_dump()


# Buscar anime en MAL por su titulo
@routerDashManga.post("/search_on_mal/", response_model=ResponseSearchMangaMAL)
async def search_on_mal(payload: PayloadSearchMangaMAL):
    listAnimes = await MangaJikanService.search_manga_mal(payload)
    return listAnimes.model_dump()


# Asignar un ID MAL  a un manga
@routerDashManga.post("/assign_id_mal/", response_model=ResponseUpdCrt)
async def assign_id_mal(payload: PayloadMangaIDMAL):
    response = await MangaJikanService.assign_id_mal_manga(payload)
    return response.model_dump()


# Actualizar un manga con su informacion desde MAL
@routerDashManga.get("/update_from_mal/{manga_id}")
async def update_from_mal(manga_id: ObjectIdStr, backTasks: BackgroundTasks):
    task_id = await task_manager.create_task(
        f"Actualización a MAL del manga con ID {manga_id}", 0
    )
    backTasks.add_task(MangaJikanService.run_update_manga_mal_back, task_id, manga_id)
    return {
        "message": "Actualización de manga iniciada en background.",
        "task_id": task_id,
    }


# Actualizar todos los mangas que esten incompletos con su informacion desde MAL
@routerDashManga.get("/update_all_to_mal/")
async def update_all_from_mal(backTasks: BackgroundTasks):
    task_id = await task_manager.create_task("Actualización masiva de mangas a MAL", 0)

    backTasks.add_task(MangaJikanService.update_all_mangas_from_mal_back, task_id)
    return {
        "message": "Actualización masiva iniciada en segundo plano.",
        "task_id": task_id,
    }


# Obtener los mangas que tienen la informacion incompleta (no han sido actualizados a su informacion con MAL)
@routerDashManga.post(
    "/get_incomplete/{ready_to_mal}", response_model=SearchMangaIncompleteSchema
)
async def get_incomplete(
    ready_to_mal: ReadyToMALEnum,
    filters: FilterSchema,
):
    incompleteMangas = await MangaService.get_incomplete_mangas(filters, ready_to_mal)

    return incompleteMangas.model_dump()


# Obtener la lista de editoriales de manga
@routerDashManga.post("/editorials_list/", response_model=SearchEditorialsSchema)
async def get_editorials(payload: FilterGSAESchema):
    response = await MangaService.editoriales_list(payload)
    return response.model_dump()


# Obtener la lista de autores de manga
@routerDashManga.post("/authors_list/", response_model=SearchAutoresSchema)
async def get_autores(payload: FilterGSAESchema):
    response = await MangaService.autores_list(payload)
    return response.model_dump()
