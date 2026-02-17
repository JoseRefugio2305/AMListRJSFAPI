from fastapi import HTTPException, status

from ..shared import GenericCRUDService
from app.repositories.manga import MangaRepository, MangaCRUDRepository
from app.repositories.favorites.favorites_repository import FavoritesRepository
from app.schemas.common.responses import ResponseUpdCrt, RespUpdMALSchema
from app.schemas.manga import (
    MangaFavPayloadSchema,
    MangaCreateSchema,
    MangaUpdateSchema,
)
from app.schemas.common.relations import CreateAutorSchema, CreateEditorialSchema
from app.schemas.anime import AniFavRespSchema
from app.schemas.auth import UserLogRespSchema
from app.core.cache.cache_manager import cache_manager
from app.core.utils import time_now_formatted, ObjectIdStr
from app.core.logging import get_logger

logger = get_logger(__name__)


class MangaCRUDService:
    # Agregar o quitar de favs y cambiar estatus de manga
    @staticmethod
    async def change_status_favs(
        data: MangaFavPayloadSchema, user: UserLogRespSchema
    ) -> AniFavRespSchema:
        # Antes de actualizar o insertar la relacion se verifica que sea un anime existente
        manga = await MangaRepository.get_by_id(data.mangaId)
        if not manga:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Manga no encontrado",
            )
        try:
            nowTS = time_now_formatted(True)
            updated = await FavoritesRepository.change_status_fav_manga(
                data, user, nowTS
            )

            # Invalidamos la busqueda especificamente para este usuario y sus favoritos para que se actualice la informacion al hacer una consulta de busqueda o de favoritos
            # Eliminamos el cache para el manga especifico para este usuario
            cache_key = cache_manager._generate_key(
                prefix=cache_manager.MANGA_PREFIX,
                key_manga=manga.key_manga,
                user_id=user.id,
            )

            await cache_manager.delete(cache_key)
            # Actualizamos el cache de busqueda para este usuario para que se actualice la informacion de favoritos al hacer una consulta de busqueda
            await cache_manager.delete_pattern(
                f"{cache_manager.SEARCH_PREFIX}_user_{user.id}:*"
            )
            # Actualizamos el cache de estadisticas para este usuario para que se actualice la informacion de favoritos al hacer una consulta de estadisticas
            await cache_manager.delete_pattern(
                f"{cache_manager.STATS_PREFIX}{user.id}:*"
            )
            logger.info(
                f"Cache invalidado: manga {manga.key_manga} para user {user.id}"
            )

            return AniFavRespSchema(active=data.active, statusView=data.statusView)
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar agregar el manga a favoritos",
            )

    # Creacion de manga
    @staticmethod
    async def create_manga(payload: MangaCreateSchema) -> ResponseUpdCrt:
        return await GenericCRUDService.create(
            MangaRepository, MangaCRUDRepository, payload, False
        )

    # Actualizacion del manga
    @staticmethod
    async def update_manga(
        payload: MangaUpdateSchema, manga_id: ObjectIdStr
    ) -> ResponseUpdCrt:
        return await GenericCRUDService.update(
            MangaRepository, MangaCRUDRepository, manga_id, payload, False
        )

    # Eliminar manga
    @staticmethod
    async def delete_manga(manga_id: ObjectIdStr) -> ResponseUpdCrt:
        return await GenericCRUDService.delete(MangaCRUDRepository, manga_id, False)

    # Insertar/Actualizar Editoriales de manga
    @staticmethod
    async def create_editorial(
        editorial: CreateEditorialSchema,
    ) -> RespUpdMALSchema:
        try:
            new_editorial = await MangaCRUDRepository.create_editorial(editorial)
            return RespUpdMALSchema(
                message="Editorial de manga agregada correctamente",
                is_success=True,
            )
        except Exception as e:
            logger.error(f"Error: {e}", exc_info=True)
            return RespUpdMALSchema(
                message="Ocurrio un error al intentar agregar la Editorial de manga",
                is_success=False,
            )

    # Insertar/Actualizar Autores de manga
    @staticmethod
    async def create_author(author: CreateAutorSchema) -> RespUpdMALSchema:
        try:
            new_author = await MangaCRUDRepository.create_author(author)
            return RespUpdMALSchema(
                message="Autor de manga agregado correctamente",
                is_success=True,
            )
        except Exception as e:
            logger.error(f"Error: {e}", exc_info=True)
            return RespUpdMALSchema(
                message="Ocurrio un error al intentar agregar el Autor de manga",
                is_success=False,
            )
