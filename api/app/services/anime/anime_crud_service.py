from fastapi import HTTPException, status
from bson.objectid import ObjectId

from app.models.anime_model import AnimeModel
from app.models.genero_model import GeneroModel
from app.models.studio_model import StudioModel
from app.models.utafavs_model import UTAFavsModel
from app.schemas.anime import (
    AniFavPayloadSchema,
    AniFavRespSchema,
    AnimeCreateSchema,
    AnimeUpdateSchema,
    ResponseUpdCrtAnime,
    RespUpdMALAnimeSchema,
)
from app.schemas.common.relations import CreateStudioSchema
from app.schemas.common.genres import CreateGenreSchema
from app.schemas.auth import UserLogRespSchema
from app.core.utils import time_now_formatted, ObjectIdStr
from app.core.logging import get_logger

logger = get_logger(__name__)


class AnimeCRUDService:

    # Agregar o quitar de favs y cambiar estatus de anime
    @staticmethod
    async def change_status_favs(
        data: AniFavPayloadSchema, user: UserLogRespSchema
    ) -> AniFavRespSchema:
        # Antes de actualizar o insertar la relacion se verifica que sea un anime existente
        anime = await AnimeModel.find_by_id(ObjectId(data.animeId))
        if not anime:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Anime no encontrado",
            )
        try:
            nowTS = time_now_formatted(True)
            updated = await UTAFavsModel.update_one(
                {"user": ObjectId(user.id), "anime": ObjectId(data.animeId)},
                {
                    "$set": {
                        "anime": ObjectId(data.animeId),
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
                detail="Error al intentar agregar el anime a favoritos",
            )

    # Metodos para administrador
    # Crear anime
    @staticmethod
    async def create_anime(payload: AnimeCreateSchema) -> ResponseUpdCrtAnime:
        # Verificamso si no existe un anime con el mismo key_anime
        existing_anime = await AnimeModel.find_one({"key_anime": payload.key_anime})
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
            insertedId = await AnimeModel.insert_one(anime_to_create)
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
            k_anime_query = (
                {"key_anime": payload.key_anime} if payload.key_anime else None
            )
            id_mal_query = {"id_MAL": payload.id_MAL} if payload.id_MAL else None
            or_query = None
            if payload.id_MAL and payload.key_anime:
                k_anime_query = {"key_anime": payload.key_anime}
                id_mal_query = {"id_MAL": payload.id_MAL}
                or_query = {"$or": [k_anime_query, id_mal_query]}
            is_existing = await AnimeModel.aggregate(
                [
                    {
                        "$match": {
                            "$and": [
                                (
                                    or_query
                                    if or_query
                                    else (
                                        k_anime_query if k_anime_query else id_mal_query
                                    )
                                ),
                                {"_id": {"$not": {"$eq": ObjectId(anime_id)}}},
                            ]
                        }
                    }
                ]
            )

            if is_existing and len(is_existing) > 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Ya existe un anime con el mismo id_MAL o key_anime",
                )

        try:
            # Actualizamos el anime si existe
            data = payload.model_dump(
                exclude_unset=True
            )  # Obtenemos solo los campos que traen algun valor diferente de None
            animeUpd = await AnimeModel.find_and_update(
                {"_id": ObjectId(anime_id)}, data, upsert=False
            )
            if not animeUpd:  # Si no se encuntra el anime a actualizar
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
            animeDel = await AnimeModel.delete_one({"_id": ObjectId(anime_id)})
            if animeDel.deleted_count == 0:  # Si no se encuntra el anime a eliminar
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No se encontro el anime a eliminar",
                )
            await UTAFavsModel.delete_many({"anime": ObjectId(anime_id)})
            return ResponseUpdCrtAnime(message="Anime eliminado correctamente")
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar eliminar el anime",
            )

    # Insertar/Actualizar genero
    @staticmethod
    async def create_genre(genre: CreateGenreSchema) -> RespUpdMALAnimeSchema:
        try:
            # Si encuentra el genero actualiza la informacion, si no lo encuentra al insertar agrega el id_MAL y la fecha de adicion
            new_genre = await GeneroModel.update_one(
                {"id_MAL": genre.id_MAL},
                {
                    "$set": {
                        "nombre": genre.nombre,
                        "nombre_mal": genre.nombre_mal,
                        "linkMAL": genre.linkMAL,
                    },
                    "$setOnInsert": {
                        "fechaAdicion": time_now_formatted(True),
                        "id_MAL": genre.id_MAL,
                    },
                },
                True,
            )
            return RespUpdMALAnimeSchema(
                message="Genero Creado Correctamente", is_success=True
            )
        except Exception as e:
            logger.error(f"Error: {e}", exc_info=True)
            return RespUpdMALAnimeSchema(
                message="Ocurrio un error al intentar agregar el genero",
                is_success=False,
            )

    # Insertar/Actualizar Estudios de animacion
    @staticmethod
    async def create_studio(studio: CreateStudioSchema) -> RespUpdMALAnimeSchema:
        try:
            new_studio = await StudioModel.update_one(
                {"id_MAL": studio.id_MAL},
                {
                    "$set": {
                        "nombre": studio.nombre,
                        "linkMAL": studio.linkMAL,
                    },
                    "$setOnInsert": {
                        "fechaAdicion": time_now_formatted(True),
                        "id_MAL": studio.id_MAL,
                    },
                },
                True,
            )
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
