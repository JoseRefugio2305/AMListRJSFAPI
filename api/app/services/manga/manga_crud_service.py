from fastapi import HTTPException, status
from bson.objectid import ObjectId

from app.models.manga_model import MangaModel
from app.models.editorial_model import EditorialModel
from app.models.author_model import AuthorModel
from app.models.utmanfavs_model import UTManFavsModel
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
        manga = await MangaModel.find_by_id(ObjectId(data.mangaId))
        if not manga:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Manga no encontrado",
            )
        try:
            nowTS = time_now_formatted(True)
            updated = await UTManFavsModel.update_one(
                {"user": ObjectId(user.id), "manga": ObjectId(data.mangaId)},
                {
                    "$set": {
                        "manga": ObjectId(data.mangaId),
                        "user": ObjectId(user.id),
                        "active": data.active,
                        "statusView": data.statusView,
                    },
                    "$setOnInsert": {
                        "fechaAdicion": nowTS,
                    },
                },
                upsert=True,
            )  # Actualizamos el registro o insertamos en caso de que no exista la relacion

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
        existing_manga = await MangaModel.find_by_key(payload.key_manga)
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
            insertedId = await MangaModel.insert_one(manga_to_create)
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
            k_manga_query = (
                {"key_manga": payload.key_manga} if payload.key_manga else None
            )
            id_mal_query = {"id_MAL": payload.id_MAL} if payload.id_MAL else None
            or_query = None
            if payload.id_MAL and payload.key_manga:
                k_manga_query = {"key_manga": payload.key_manga}
                id_mal_query = {"id_MAL": payload.id_MAL}
                or_query = {"$or": [k_manga_query, id_mal_query]}
            is_existing = await MangaModel.aggregate(
                [
                    {
                        "$match": {
                            "$and": [
                                (
                                    or_query
                                    if or_query
                                    else (
                                        k_manga_query if k_manga_query else id_mal_query
                                    )
                                ),
                                {"_id": {"$not": {"$eq": ObjectId(manga_id)}}},
                            ]
                        }
                    }
                ]
            )

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
            mangaUpd = await MangaModel.find_and_update(
                {"_id": ObjectId(manga_id)}, data, upsert=False
            )
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
            mangaDel = await MangaModel.delete_one({"_id": ObjectId(manga_id)})
            if mangaDel.deleted_count == 0:  # Si no se encuntra el manga a eliminar
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No se encontro el manga a eliminar",
                )
            await UTManFavsModel.delete_many({"manga": ObjectId(manga_id)})
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
            new_editorial = await EditorialModel.update_one(
                {"id_MAL": editorial.id_MAL},
                {
                    "$set": {
                        "nombre": editorial.nombre,
                        "linkMAL": editorial.linkMAL,
                    },
                    "$setOnInsert": {
                        "tipo": editorial.tipo,
                        "fechaAdicion": time_now_formatted(True),
                        "id_MAL": editorial.id_MAL,
                    },
                },
                True,
            )
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
            new_author = await AuthorModel.update_one(
                {"id_MAL": author.id_MAL},
                {
                    "$set": {
                        "nombre": author.nombre,
                        "linkMAL": author.linkMAL,
                    },
                    "$setOnInsert": {
                        "tipo": author.tipo,
                        "fechaAdicion": time_now_formatted(True),
                        "id_MAL": author.id_MAL,
                    },
                },
                True,
            )
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
