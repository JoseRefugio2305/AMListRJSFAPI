from fastapi import HTTPException, status
from typing import Optional
from bson.objectid import ObjectId
import math

from .manga_utils import dict_to_manga_schema, dict_to_incomplete_manga
from app.models.manga_model import MangaModel
from app.models.editorial_model import EditorialModel
from app.models.author_model import AuthorModel
from app.models.utmanfavs_model import UTManFavsModel
from app.schemas.manga import (
    MangaSchema,
    MangaFavPayloadSchema,
    MangaCreateSchema,
    MangaUpdateSchema,
    ResponseUpdCrtManga,
    CreateEditorialSchema,
    CreateAutorSchema,
)
from app.schemas.anime import AniFavRespSchema, RespUpdMALAnimeSchema
from app.schemas.search import (
    MangaSearchSchema,
    FilterSchema,
    ReadyToMALEnum,
    SearchMangaIncompleteSchema,
)
from app.schemas.auth import UserLogRespSchema
from app.core.utils import (
    object_id_to_str,
    objects_id_list_to_str,
    time_now_formatted,
    ObjectIdStr,
)
from app.core.database import (
    lookup_user_favorites,
    filtro_emision,
    filtrado_tipos,
    filtrado_busqueda_avanzada_manga,
    apply_paginacion_ordenacion,
)

from app.core.logging import get_logger

logger = get_logger(__name__)


class MangaService:
    # Encontrar la lista de animes por pagina de busqueda, solo se obtendran los que estan finalizados
    @staticmethod
    async def get_all(
        filters: FilterSchema, user: Optional[UserLogRespSchema] = None
    ) -> MangaSearchSchema:
        pipeline = [
            {
                "$match": {"linkMAL": {"$not": {"$eq": None}}},
            },
            *filtrado_tipos(filters.tiposManga, False),
            *filtro_emision(filters.emision, "publicando"),
            *filtrado_busqueda_avanzada_manga(filters),
            *lookup_user_favorites(
                user.id if user else None,
                "manga",
                "utmanfavs",
                filters.onlyFavs,
                filters.statusView,
            ),
        ]
        logger.debug(pipeline)

        # Obtenemos el conteo de los animes que concuerdan con la busqueda
        totalMangas = await MangaModel.aggregate([*pipeline, {"$count": "totalMangas"}])

        totalMangas = totalMangas[0]["totalMangas"] if len(totalMangas) > 0 else 0
        # Aplicamos la limitacion a la busqueda
        pipeline.extend(
            apply_paginacion_ordenacion(
                filters.limit, filters.page, filters.orderBy, filters.orderField, False
            )
        )
        results = (
            objects_id_list_to_str(await MangaModel.aggregate(pipeline))
            if totalMangas
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        return MangaSearchSchema(
            listaMangas=[
                dict_to_manga_schema(r, True if user else False) for r in results
            ],
            pageM=filters.page,
            totalPagesM=math.ceil(totalMangas / filters.limit),
            totalMangas=totalMangas,
        )

    # Detalles del anime
    @staticmethod
    async def get_manga_by_id(
        key_manga: int, user: Optional[UserLogRespSchema] = None
    ) -> MangaSchema:
        pipeline = [
            {
                "$match": {"key_manga": key_manga},
            },
            *lookup_user_favorites(
                user.id if user else None, "manga", "utmanfavs", False, 5
            ),
        ]
        results = await MangaModel.aggregate(pipeline)

        if len(results) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Manga no encontrado",
            )
        manga = object_id_to_str(
            results[0]
        )  # Agregate retorna por defecto una lista, por lo cual se debe de tomar el primer elemento, si no da resultados, seria un elemento vacio
        return dict_to_manga_schema(manga, True if user else False)

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
                        "fechaAdicion": nowTS,
                    }
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
        except:
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
        except:
            return RespUpdMALAnimeSchema(
                message="Ocurrio un error al intentar agregar el Autor de manga",
                is_success=False,
            )

    # Obtener los mangas incompletos
    @staticmethod
    async def get_incomplete_mangas(
        filters: FilterSchema, ready_to_mal: ReadyToMALEnum = ReadyToMALEnum.todos
    ) -> SearchMangaIncompleteSchema:
        # Verificamos si quiere solo los listos para actualizarse a mal, es decir, aquellos con un id_MAL ya asignado
        q_r_to_mal = [
            {"linkMAL": {"$eq": None}},
            (
                {"id_MAL": {"$not": {"$eq": None}}}
                if ready_to_mal == ReadyToMALEnum.listo
                else (
                    {"id_MAL": {"$eq": None}}
                    if ready_to_mal == ReadyToMALEnum.no_listo
                    else {}
                )
            ),
        ]

        pipeline = [
            {"$match": {"$and": q_r_to_mal}},
            *filtrado_tipos(filters.tiposManga, False),
            *filtrado_busqueda_avanzada_manga(filters),
        ]
        logger.debug(pipeline)

        # Obtenemos el conteo de los mangas que tienen su informacion incompleta
        totalMangas = await MangaModel.aggregate([*pipeline, {"$count": "totalMangas"}])

        totalMangas = totalMangas[0]["totalMangas"] if len(totalMangas) > 0 else 0
        # Aplicamos la limitacion a la busqueda
        pipeline.extend(
            apply_paginacion_ordenacion(
                filters.limit, filters.page, filters.orderBy, filters.orderField, False
            )
        )
        results = (
            objects_id_list_to_str(await MangaModel.aggregate(pipeline))
            if totalMangas
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        results = [dict_to_incomplete_manga(a) for a in results]

        logger.debug(results)
        return SearchMangaIncompleteSchema(
            listaMangas=results,
            totalMangas=totalMangas,
            totalPages=math.ceil(totalMangas / filters.limit),
            page=filters.page,
        )
