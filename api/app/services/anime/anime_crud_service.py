from fastapi import HTTPException, status

from ..shared import GenericCRUDService
from app.schemas.common.responses import ResponseUpdCrt, RespUpdMALSchema
from app.schemas.anime import (
    AniFavPayloadSchema,
    AniFavRespSchema,
    AnimeCreateSchema,
    AnimeUpdateSchema,
)
from app.schemas.common.relations import CreateStudioSchema
from app.schemas.auth import UserLogRespSchema
from app.core.utils import time_now_formatted, ObjectIdStr
from app.repositories.anime import AnimeRepository, AnimeCRUDRepository
from app.repositories.favorites.favorites_repository import FavoritesRepository
from app.core.cache.cache_manager import cache_manager
from app.core.logging import get_logger

logger = get_logger(__name__)


class AnimeCRUDService:

    # Agregar o quitar de favs y cambiar estatus de anime
    @staticmethod
    async def change_status_favs(
        data: AniFavPayloadSchema, user: UserLogRespSchema
    ) -> AniFavRespSchema:
        # Antes de actualizar o insertar la relacion se verifica que sea un anime existente
        anime = await AnimeRepository.get_by_id(data.animeId)
        if not anime:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Anime no encontrado",
            )
        try:
            nowTS = time_now_formatted(True)
            updated = await FavoritesRepository.change_status_fav_anime(
                data, user, nowTS
            )

            # Invalidamos la busqueda especificamente para este usuario y sus favoritos para que se actualice la informacion al hacer una consulta de busqueda o de favoritos
            cache_key = cache_manager._generate_key(
                prefix=cache_manager.ANIME_PREFIX,
                key_anime=anime.key_anime,
                user_id=user.id,
            )

            await cache_manager.delete(cache_key)

            await cache_manager.delete_pattern(
                f"{cache_manager.SEARCH_PREFIX}_user_{user.id}:*"
            )
            await cache_manager.delete_pattern(
                f"{cache_manager.STATS_PREFIX}{user.id}:*"
            )
            logger.info(
                f"Cache invalidado: anime {anime.key_anime} para user {user.id}"
            )

            return AniFavRespSchema(active=data.active, statusView=data.statusView)
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar agregar el anime a favoritos",
            )

    # Metodos para administrador
    # Crear anime
    @staticmethod
    async def create_anime(payload: AnimeCreateSchema) -> ResponseUpdCrt:
        return await GenericCRUDService.create(
            AnimeRepository, AnimeCRUDRepository, payload, True
        )

    # Actualizacion del anime
    @staticmethod
    async def update_anime(
        anime_id: ObjectIdStr, payload: AnimeUpdateSchema
    ) -> ResponseUpdCrt:
        return await GenericCRUDService.update(
            AnimeRepository, AnimeCRUDRepository, anime_id, payload, True
        )

    # Eliminar anime
    @staticmethod
    async def delete_anime(anime_id: ObjectIdStr) -> ResponseUpdCrt:
        return await GenericCRUDService.delete(AnimeCRUDRepository, anime_id, True)

    # Insertar/Actualizar Estudios de animacion
    @staticmethod
    async def create_studio(studio: CreateStudioSchema) -> RespUpdMALSchema:
        try:
            new_studio = await AnimeCRUDRepository.create_studio(studio)
            return RespUpdMALSchema(
                message="Estudio de animacion agregado correctamente",
                is_success=True,
            )
        except Exception as e:
            logger.error(f"Error: {e}", exc_info=True)
            return RespUpdMALSchema(
                message="Ocurrio un error al intentar agregar el estudio de animacion",
                is_success=False,
            )
