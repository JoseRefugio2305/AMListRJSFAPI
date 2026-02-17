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
from app.core.cache.cache_manager import cache_manager
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
        cached_result = await cache_manager.get_search(
            filters.model_dump(), filters.page, filters.limit, False, user_id
        )

        if cached_result is not None:
            logger.debug(f"Cache HIT para búsqueda filtrada con user_id: {user_id}")
            return cached_result["data"], cached_result["total"]

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
        pipeline = [
            {
                "$facet": {
                    "totales": [*pipeline, {"$count": "totalMangas"}],
                    "mangas": [
                        *pipeline,
                        *apply_paginacion_ordenacion(
                            filters.limit,
                            filters.page,
                            filters.orderBy,
                            filters.orderField,
                            False,
                        ),
                    ],
                }
            }
        ]

        results = await MangaModel.aggregate(pipeline).to_list()

        totalMangas = (
            results[0]["totales"][0]["totalMangas"]
            if len(results[0]["totales"]) > 0
            else 0
        )

        results = (
            results[0]["mangas"]
            if totalMangas
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        await cache_manager.set_search(
            filters.model_dump(),
            filters.page,
            filters.limit,
            {"data": results, "total": totalMangas},
            False,
            user_id,
        )

        return results, totalMangas

    @staticmethod
    async def get_by_key(key_manga: int, user_id: ObjectIdStr | None = None):
        cached_manga = await cache_manager.get_manga(key_manga, user_id)

        if cached_manga is not None:
            logger.debug(
                f"Cache HIT para manga con key_manga: {key_manga} y user_id: {user_id}"
            )
            return cached_manga

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
        result = await MangaModel.aggregate(pipeline).to_list()

        if len(result) > 0:
            await cache_manager.set_manga(key_manga, result[0], user_id)

        return result[0] if len(result) > 0 else None

    @staticmethod
    async def get_by_id(manga_id: ObjectIdStr):
        return await MangaModel.find_one(MangaModel.id == ObjectId(manga_id))

    @staticmethod
    async def get_by_id_MAL(id_MAL: int):
        return await MangaModel.find_one(MangaModel.id_MAL == id_MAL)

    @staticmethod
    async def get_to_update_mal(manga_id: ObjectIdStr):
        return await MangaModel.find_one(
            MangaModel.id == ObjectId(manga_id), MangaModel.id_MAL != None
        )

    @staticmethod
    async def get_all_ready_to_mal():
        return await MangaModel.aggregate(filtrado_info_incompleta(True)).to_list()

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
        ).to_list()

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

        pipeline = [
            {
                "$facet": {
                    "totales": [*pipeline, {"$count": "totalMangas"}],
                    "mangas_incomplete": [
                        *pipeline,
                        *apply_paginacion_ordenacion(
                            filters.limit,
                            filters.page,
                            filters.orderBy,
                            filters.orderField,
                            False,
                        ),
                    ],
                }
            }
        ]
        logger.debug(pipeline)

        # Obtenemos el conteo de los mangas que tienen su informacion incompleta
        results = await MangaModel.aggregate(pipeline).to_list()

        totalMangas = (
            results[0]["totales"][0]["totalMangas"]
            if len(results[0]["totales"]) > 0
            else 0
        )

        results = (
            results[0]["mangas_incomplete"]
            if totalMangas
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        return results, totalMangas

    @staticmethod
    async def get_editorials(filters: FilterGSAESchema):
        pipeline = [filtrado_gsae(filters.txtSearch, True)]
        pipeline = [
            {
                "$facet": {
                    "totales": [*pipeline, {"$count": "totalEditoriales"}],
                    "editoriales": [
                        *pipeline,
                        *apply_paginacion_ordenacion(
                            filters.limit,
                            filters.page,
                            filters.orderBy,
                            filters.orderField,
                            False,
                        ),
                    ],
                }
            }
        ]
        logger.debug(pipeline)
        results = await EditorialModel.aggregate(pipeline).to_list()

        totalEditoriales = (
            results[0]["totales"][0]["totalEditoriales"]
            if len(results[0]["totales"]) > 0
            else 0
        )

        return results[0]["editoriales"], totalEditoriales

    @staticmethod
    async def get_authors(filters: FilterGSAESchema):
        pipeline = [filtrado_gsae(filters.txtSearch, True)]
        pipeline = [
            {
                "$facet": {
                    "totales": [*pipeline, {"$count": "totalAutores"}],
                    "autores": [
                        *pipeline,
                        *apply_paginacion_ordenacion(
                            filters.limit,
                            filters.page,
                            filters.orderBy,
                            filters.orderField,
                            False,
                        ),
                    ],
                }
            }
        ]
        logger.debug(pipeline)
        results = await AuthorModel.aggregate(pipeline).to_list()
        totalAutores = (
            results[0]["totales"][0]["totalAutores"]
            if len(results[0]["totales"]) > 0
            else 0
        )

        return results[0]["autores"], totalAutores
