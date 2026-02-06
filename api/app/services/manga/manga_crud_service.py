from fastapi import HTTPException, status

from app.repositories.manga import MangaRepository, MangaCRUDRepository
from app.repositories.favorites.favorites_repository import FavoritesRepository
from app.schemas.manga import (
    MangaFavPayloadSchema,
    MangaCreateSchema,
    MangaUpdateSchema,
    ResponseUpdCrtManga,
)
from app.schemas.common.relations import CreateAutorSchema, CreateEditorialSchema
from app.schemas.anime import AniFavRespSchema, RespUpdMALAnimeSchema
from app.schemas.auth import UserLogRespSchema
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

            return AniFavRespSchema(active=data.active, statusView=data.statusView)
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar agregar el manga a favoritos",
            )

    # Creacion de manga
    @staticmethod
    async def create_manga(payload: MangaCreateSchema) -> ResponseUpdCrtManga:
        # Revisamos primero si no existe un manga con el mismo key
        existing_manga = await MangaRepository.get_by_key(payload.key_manga, None)
        if existing_manga:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un manga con el mismo key_manga",
            )

        try:
            # Antes de crearlo agregamos la fecha en que se crea
            manga_to_create = payload.model_dump()
            manga_to_create["fechaAdicion"] = time_now_formatted(True)
            # Creamos el nuevo Manga
            insertedId = await MangaCRUDRepository.create(manga_to_create)
            logger.info(f"Manga registrado: {insertedId}")
            return ResponseUpdCrtManga(message="Manga creado correctamente")
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar agregar el manga",
            )

    # Actualizacion del manga
    @staticmethod
    async def update_manga(
        payload: MangaUpdateSchema, manga_id: ObjectIdStr
    ) -> ResponseUpdCrtManga:
        if payload and (payload.id_MAL or payload.key_manga):
            # Primero revisamos si no existe algun otro manga que contenga el mismo id_MAL o key_manga al que se quiere actualizar y que no sea el manga que qeuremos actualizar (lo excluimos por su id)
            # Esto solo lo hacemos si se recibe el key manga y/o el id_MAL en el payload
            is_existing = await MangaRepository.is_exists_to_update(manga_id, payload)

            if is_existing and len(is_existing) > 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Ya existe un manga con el mismo id_MAL o key_manga",
                )
        try:
            # Actualizamos el manga si existe
            data = payload.model_dump(
                exclude_unset=True
            )  # Obtenemos solo los campos que traen algun valor diferente de None
            mangaUpd = await MangaCRUDRepository.update(manga_id, data)
            if not mangaUpd:  # Si no se encuntra el manga a actualizar
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No se encontro el manga a actualizar",
                )
            return ResponseUpdCrtManga(message="Manga actualizado correctamente")
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar actualizar el manga",
            )

    # Eliminar manga
    @staticmethod
    async def delete_manga(manga_id: ObjectIdStr) -> ResponseUpdCrtManga:
        try:
            # Eliminamos el manga si existe
            deleted_manga = await MangaCRUDRepository.delete(manga_id)
            if not deleted_manga:  # Si no se encuntra el manga a eliminar
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No se encontro el manga a eliminar",
                )
            return ResponseUpdCrtManga(message="Manga eliminado correctamente")
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar eliminar el manga",
            )

    # Insertar/Actualizar Editoriales de manga
    @staticmethod
    async def create_editorial(
        editorial: CreateEditorialSchema,
    ) -> RespUpdMALAnimeSchema:
        try:
            new_editorial = await MangaCRUDRepository.create_editorial(editorial)
            return RespUpdMALAnimeSchema(
                message="Editorial de manga agregada correctamente",
                is_success=True,
            )
        except Exception as e:
            logger.error(f"Error: {e}", exc_info=True)
            return RespUpdMALAnimeSchema(
                message="Ocurrio un error al intentar agregar la Editorial de manga",
                is_success=False,
            )

    # Insertar/Actualizar Autores de manga
    @staticmethod
    async def create_author(author: CreateAutorSchema) -> RespUpdMALAnimeSchema:
        try:
            new_author = await MangaCRUDRepository.create_author(author)
            return RespUpdMALAnimeSchema(
                message="Autor de manga agregado correctamente",
                is_success=True,
            )
        except Exception as e:
            logger.error(f"Error: {e}", exc_info=True)
            return RespUpdMALAnimeSchema(
                message="Ocurrio un error al intentar agregar el Autor de manga",
                is_success=False,
            )
