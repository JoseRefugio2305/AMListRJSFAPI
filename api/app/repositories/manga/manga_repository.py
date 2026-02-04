from bson import ObjectId

from app.schemas.search import FilterSchema, ReadyToMALEnum, FilterGSAESchema
from app.schemas.manga import MangaUpdateSchema
from app.core.utils import ObjectIdStr
from ..pipeline_builders.manga import (
    filtrado_busqueda_avanzada_manga,
    get_full_manga,
)
from ..pipeline_builders.common import (
    lookup_user_favorites,
    filtro_emision,
    filtrado_tipos,
    apply_paginacion_ordenacion,
    filtrado_gsae,
    filtrado_info_incompleta,
)
from app.models.manga_model import MangaModel
from app.models.editorial_model import EditorialModel
from app.models.author_model import AuthorModel
from app.core.logging import get_logger

logger = get_logger(__name__)


class MangaRepository:
    @staticmethod
    async def find_all_filtered(
        filters: FilterSchema, user_id: ObjectIdStr | None = None
    ):
        pipeline = [
            {
                "$match": {"linkMAL": {"$not": {"$eq": None}}},
            },
            *filtrado_tipos(filters.tiposManga, False),
            *filtro_emision(filters.emision, "publicando"),
            *filtrado_busqueda_avanzada_manga(filters),
            *lookup_user_favorites(
                user_id if user_id else None,
                "manga",
                "utmanfavs",
                filters.onlyFavs,
                filters.statusView,
            ),
        ]

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
            await MangaModel.aggregate(pipeline)
            if totalMangas
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        return results, totalMangas

    @staticmethod
    async def get_manga_by_key(key_manga: int, user_id: ObjectIdStr | None = None):
        pipeline = [
            {
                "$match": {"key_manga": key_manga},
            },
            *get_full_manga(),
            *lookup_user_favorites(
                user_id if user_id else None, "manga", "utmanfavs", False, 5
            ),
        ]
        logger.debug(pipeline)
        result = await MangaModel.aggregate(pipeline)

        return result[0] if len(result) > 0 else None

    @staticmethod
    async def get_manga_by_id(manga_id: ObjectIdStr):
        return await MangaModel.find_by_id(ObjectId(manga_id))

    @staticmethod
    async def get_manga_by_id_MAL(id_MAL: int):
        return await MangaModel.find_one({"id_MAL": id_MAL})

    @staticmethod
    async def get_manga_to_update_mal(manga_id: ObjectIdStr):
        return await MangaModel.find_one(
            {"_id": ObjectId(manga_id), "id_MAL": {"$not": {"$eq": None}}}
        )

    @staticmethod
    async def get_all_ready_to_mal():
        return await MangaModel.aggregate(filtrado_info_incompleta(True))

    @staticmethod
    async def is_exists_to_update(manga_id: ObjectIdStr, payload: MangaUpdateSchema):
        k_manga_query = {"key_manga": payload.key_manga} if payload.key_manga else None
        id_mal_query = {"id_MAL": payload.id_MAL} if payload.id_MAL else None
        or_query = None
        if payload.id_MAL and payload.key_manga:
            k_manga_query = {"key_manga": payload.key_manga}
            id_mal_query = {"id_MAL": payload.id_MAL}
            or_query = {"$or": [k_manga_query, id_mal_query]}
        result = await MangaModel.aggregate(
            [
                {
                    "$match": {
                        "$and": [
                            (
                                or_query
                                if or_query
                                else (k_manga_query if k_manga_query else id_mal_query)
                            ),
                            {"_id": {"$not": {"$eq": ObjectId(manga_id)}}},
                        ]
                    }
                }
            ]
        )

        return result and len(result) > 0

    @staticmethod
    async def find_all_incomplete_filtered(
        filters: FilterSchema, ready_to_mal: ReadyToMALEnum = ReadyToMALEnum.todos
    ):
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
            await MangaModel.aggregate(pipeline)
            if totalMangas
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        return results, totalMangas

    @staticmethod
    async def get_editorials(filters: FilterGSAESchema):
        pipeline = [filtrado_gsae(filters.txtSearch, True)]
        logger.debug(pipeline)
        editoriales = await EditorialModel.aggregate(
            [
                *pipeline,
                *apply_paginacion_ordenacion(
                    filters.limit,
                    filters.page,
                    filters.orderBy,
                    filters.orderField,
                    False,
                ),
            ]
        )

        totalEditoriales = await EditorialModel.aggregate(
            [*pipeline, {"$count": "totalEditoriales"}]
        )
        totalEditoriales = (
            totalEditoriales[0]["totalEditoriales"] if len(totalEditoriales) > 0 else 0
        )

        return editoriales, totalEditoriales

    @staticmethod
    async def get_authors(filters: FilterGSAESchema):
        pipeline = [filtrado_gsae(filters.txtSearch, True)]
        logger.debug(pipeline)
        autores = await AuthorModel.aggregate(
            [
                *pipeline,
                *apply_paginacion_ordenacion(
                    filters.limit,
                    filters.page,
                    filters.orderBy,
                    filters.orderField,
                    False,
                ),
            ]
        )

        totalAutores = await AuthorModel.aggregate(
            [*pipeline, {"$count": "totalAutores"}]
        )
        totalAutores = totalAutores[0]["totalAutores"] if len(totalAutores) > 0 else 0

        return autores, totalAutores
