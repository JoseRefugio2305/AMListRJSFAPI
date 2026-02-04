from fastapi import HTTPException, status

from app.schemas.anime import (
    AniFavPayloadSchema,
    AniFavRespSchema,
    AnimeCreateSchema,
    AnimeUpdateSchema,
    ResponseUpdCrtAnime,
    RespUpdMALAnimeSchema,
)
from app.schemas.common.relations import CreateStudioSchema
from app.schemas.auth import UserLogRespSchema
from app.core.utils import time_now_formatted, ObjectIdStr
from app.repositories.anime import AnimeRepository, AnimeCRUDRepository
from app.repositories.favorites.favorites_repository import FavoritesRepository
from app.core.logging import get_logger

logger = get_logger(__name__)


class AnimeCRUDService:

    # Agregar o quitar de favs y cambiar estatus de anime
    @staticmethod
    async def change_status_favs(
        data: AniFavPayloadSchema, user: UserLogRespSchema
    ) -> AniFavRespSchema:
        # Antes de actualizar o insertar la relacion se verifica que sea un anime existente
        anime = await AnimeRepository.get_anime_by_id(data.animeId)
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

            return AniFavRespSchema(active=data.active, statusView=data.statusView)
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar agregar el anime a favoritos",
            )

    # Metodos para administrador
    # Crear anime
    @staticmethod
    async def create_anime(payload: AnimeCreateSchema) -> ResponseUpdCrtAnime:
        # Verificamso si no existe un anime con el mismo key_anime
        existing_anime = await AnimeRepository.get_anime_by_key(payload.key_anime, None)
        if existing_anime:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un anime con el mismo key_anime",
            )

        try:
            # Antes de crearlo agregamos la fecha en que se crea
            anime_to_create = payload.model_dump()
            anime_to_create["fechaAdicion"] = time_now_formatted(True)
            # Creamos el nuevo anime
            insertedId = await AnimeCRUDRepository.create_anime(anime_to_create)
            logger.info(f"Anime registrado: {insertedId}")
            return ResponseUpdCrtAnime(message="Anime creado correctamente")
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar agregar el anime",
            )

    # Actualizacion del anime
    @staticmethod
    async def update_anime(
        anime_id: ObjectIdStr, payload: AnimeUpdateSchema
    ) -> ResponseUpdCrtAnime:
        if payload and (payload.id_MAL or payload.key_anime):
            # Primero revisamos si no existe algun otro anime que contenga el mismo id_MAL o key_anime al que se quiere actualizar y que no sea el anime que qeuremos actualizar (lo excluimos por su id)
            # Esto solo lo hacemos si se recibe el key anime y/o el id_MAL en el payload
            is_existing = await AnimeRepository.is_exists_to_update(anime_id, payload)

            if is_existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Ya existe un anime con el mismo id_MAL o key_anime",
                )

        try:
            # Actualizamos el anime si existe
            # Obtenemos solo los campos que traen algun valor diferente de None
            data = payload.model_dump(exclude_unset=True)
            anime_updated = await AnimeCRUDRepository.update_anime(anime_id, data)
            if not anime_updated:  # Si no se encuntra el anime a actualizar
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No se encontro el anime a actualizar",
                )
            return ResponseUpdCrtAnime(message="Anime actualizado correctamente")
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar actualizar el anime",
            )

    # Eliminar anime
    @staticmethod
    async def delete_anime(anime_id: ObjectIdStr) -> ResponseUpdCrtAnime:
        try:
            # Eliminamos el anime si existe
            animeDel = await AnimeCRUDRepository.delete_anime(anime_id)
            if not animeDel:  # Si no se encuntra el anime a eliminar
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No se encontro el anime a eliminar",
                )
            return ResponseUpdCrtAnime(message="Anime eliminado correctamente")
        except HTTPException as e:
            logger.error(f"Error: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar eliminar el anime",
            )

    # Insertar/Actualizar Estudios de animacion
    @staticmethod
    async def create_studio(studio: CreateStudioSchema) -> RespUpdMALAnimeSchema:
        try:
            new_studio = await AnimeCRUDRepository.create_studio(studio)
            return RespUpdMALAnimeSchema(
                message="Estudio de animacion agregado correctamente",
                is_success=True,
            )
        except Exception as e:
            logger.error(f"Error: {e}", exc_info=True)
            return RespUpdMALAnimeSchema(
                message="Ocurrio un error al intentar agregar el estudio de animacion",
                is_success=False,
            )
