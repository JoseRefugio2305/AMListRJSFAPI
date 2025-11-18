from fastapi import APIRouter, Depends, HTTPException

from app.services.manga import MangaService, MangaJikanService
from app.core.security import require_admin
from app.core.utils import ObjectIdStr
from app.schemas.auth import UserLogRespSchema
from app.schemas.anime import (
    PayloadAnimeIDMAL,
    ResponseUpdAllMALSchema,
    RespUpdMALAnimeSchema,
)
from app.schemas.manga import MangaCreateSchema, MangaUpdateSchema, ResponseUpdCrtManga
from app.schemas.search import (
    PayloadSearchAnimeMAL,
    ResponseSearchMangaMAL,
    SearchMangaIncompleteSchema,
    ReadyToMALEnum,
    FilterSchema,
)

from app.core.logging import get_logger

logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerDashManga = APIRouter(prefix="/dashboard", tags=["dashboard"])


# Ruta de creacion de manga
@routerDashManga.post("/create_manga/", response_model=ResponseUpdCrtManga)
async def create_manga(
    payload: MangaCreateSchema, user: UserLogRespSchema = Depends(require_admin)
):
    response = await MangaService.create_manga(payload)
    return response.model_dump()


# Ruta para actualizar manga
@routerDashManga.put("/update_manga/{manga_id}", response_model=ResponseUpdCrtManga)
async def update_anime(
    manga_id: ObjectIdStr,
    payload: MangaUpdateSchema = None,
    user: UserLogRespSchema = Depends(require_admin),
):
    # SI no se recibe informacion para actualizar se lanza un error
    if payload is None:
        raise HTTPException(
            status_code=400, detail="No se proporcionaron datos para actualizar"
        )
    response = await MangaService.update_manga(payload=payload, manga_id=manga_id)
    return response.model_dump()


# Eliminar manga
@routerDashManga.delete("/delete_manga/{manga_id}", response_model=ResponseUpdCrtManga)
async def delete_manga(
    manga_id: ObjectIdStr, user: UserLogRespSchema = Depends(require_admin)
):

    response = await MangaService.delete_manga(manga_id)

    return response.model_dump()


# Buscar anime en MAL por su titulo
@routerDashManga.post("/search_manga_on_mal/", response_model=ResponseSearchMangaMAL)
async def search_manga_mal(
    payload: PayloadSearchAnimeMAL, user: UserLogRespSchema = Depends(require_admin)
):
    listAnimes = await MangaJikanService.search_manga_mal(payload)
    return listAnimes.model_dump()


# Asignar un ID MAL  a un manga
@routerDashManga.post("/assign_id_mal_manga/", response_model=ResponseUpdCrtManga)
async def assign_id_mal_manga(
    payload: PayloadAnimeIDMAL, user: UserLogRespSchema = Depends(require_admin)
):
    response = await MangaJikanService.assign_id_mal_manga(payload)
    return response.model_dump()


# Actualizar un manga con su informacion desde MAL
@routerDashManga.get(
    "/update_manga_from_mal/{manga_id}", response_model=RespUpdMALAnimeSchema
)
async def update_manga_from_mal(
    manga_id: ObjectIdStr, user: UserLogRespSchema = Depends(require_admin)
):
    response = await MangaJikanService.update_manga_from_mal(
        mangaId=manga_id, is_all=False
    )
    return response.model_dump()


# Actualizar todos los mangas que esten incompletos con su informacion desde MAL
@routerDashManga.get(
    "/update_all_mangas_to_mal/", response_model=ResponseUpdAllMALSchema
)
async def update_all_mangas_from_mal(user: UserLogRespSchema = Depends(require_admin)):
    response = await MangaJikanService.update_all_mangas_from_mal()
    return response.model_dump()


# Obtener los mangas que tienen la informacion incompleta (no han sido actualizados a su informacion con MAL)
@routerDashManga.post(
    "/get_incomplete_mangas/{ready_to_mal}", response_model=SearchMangaIncompleteSchema
)
async def get_incomplete_mangas(
    ready_to_mal: ReadyToMALEnum,
    filters: FilterSchema,
    user: UserLogRespSchema = Depends(require_admin),
):
    incompleteMangas = await MangaService.get_incomplete_mangas(filters, ready_to_mal)

    return incompleteMangas.model_dump()
