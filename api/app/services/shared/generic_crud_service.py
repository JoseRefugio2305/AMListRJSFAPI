from fastapi import HTTPException, status
from typing import Type, TypeVar
from pydantic import BaseModel

from app.schemas.common.responses import ResponseUpdCrt
from app.core.utils import time_now_formatted, ObjectIdStr
from app.core.logging import get_logger

logger = get_logger(__name__)

T = TypeVar("T", bound=BaseModel)


class GenericCRUDService:
    @staticmethod
    async def create(
        repository: Type, crud_repository: Type, payload: T, is_anime: bool = True
    ) -> ResponseUpdCrt:
        key_value = getattr(payload, "key_anime" if is_anime else "key_manga", None)
        is_exists = await repository.get_by_key(key_value, None)
        if is_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un elemento con la misma Key.",
            )

        try:
            # Antes de crearlo agregamos la fecha en que se crea
            element_to_create = payload.model_dump()
            element_to_create["fechaAdicion"] = time_now_formatted(True)
            # Creamos el nuevo Manga/Anime
            insertedId = await crud_repository.create(element_to_create)
            logger.info(f"{"Anime" if is_anime else "Manga"} registrado: {insertedId}")
            return ResponseUpdCrt(
                message=f"{"Anime" if is_anime else "Manga"} creado correctamente"
            )
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error al intentar agregar el {"Anime" if is_anime else "Manga"}",
            )

    @staticmethod
    async def update(
        repository: Type,
        crud_repository: Type,
        item_id: ObjectIdStr,
        payload: T,
        is_anime: bool = True,
    ) -> ResponseUpdCrt:
        id_MAL = getattr(payload, "id_MAL", None)
        key_value = getattr(payload, "key_anime" if is_anime else "key_manga", None)
        if payload and (id_MAL or key_value):
            # Primero revisamos si no existe algun otro anime/manga que contenga el mismo id_MAL o key_anime/manga al que se quiere actualizar y que no sea el anime/manga que qeuremos actualizar (lo excluimos por su id)
            # Esto solo lo hacemos si se recibe el key anime/manga y/o el id_MAL en el payload
            is_existing = await repository.is_exists_to_update(item_id, payload)

            if is_existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Ya existe un {"Anime" if is_anime else "Manga"} con el mismo id_MAL o key",
                )

        try:
            # Actualizamos el anime/manga si existe
            # Obtenemos solo los campos que traen algun valor diferente de None
            data = payload.model_dump(exclude_unset=True)
            item_updated = await crud_repository.update(item_id, data)
            if not item_updated:  # Si no se encuntra el anime/manga a actualizar
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No se encontro el {"Anime" if is_anime else "Manga"} a actualizar",
                )
            return ResponseUpdCrt(
                message=f"{"Anime" if is_anime else "Manga"} actualizado correctamente"
            )
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error al intentar actualizar el {"Anime" if is_anime else "Manga"}",
            )

    @staticmethod
    async def delete(
        crud_repository: Type, item_id: ObjectIdStr, is_anime: bool = True
    ) -> ResponseUpdCrt:
        try:
            # Eliminamos el anime/manga si existe
            item_deleted = await crud_repository.delete(item_id)
            if not item_deleted:  # Si no se encuntra el anime/manga a eliminar
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No se encontro el {"Anime" if is_anime else "Manga"} a eliminar",
                )
            return ResponseUpdCrt(
                message=f"{"Anime" if is_anime else "Manga"} eliminado correctamente"
            )
        except HTTPException as e:
            logger.error(f"Error: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error al intentar eliminar el {"Anime" if is_anime else "Manga"}",
            )
