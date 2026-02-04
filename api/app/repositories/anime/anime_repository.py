from bson import ObjectId
from typing import List

from app.schemas.search import FilterSchema, ReadyToMALEnum, FilterGSAESchema
from app.schemas.anime import AnimeUpdateSchema
from app.core.utils import ObjectIdStr
from ..pipeline_builders.anime import (
    filtrado_busqueda_avanzada_anime,
    get_full_anime,
)
from ..pipeline_builders.common import (
    lookup_user_favorites,
    filtro_emision,
    filtrado_tipos,
    apply_paginacion_ordenacion,
    filtrado_gsae,
)
from app.models.anime_model import AnimeModel
from app.models.studio_model import StudioModel
from ..pipeline_builders.common import filtrado_info_incompleta
from app.core.logging import get_logger

logger = get_logger(__name__)


class AnimeRepository:
    @staticmethod
    async def find_all_filtered(
        filters: FilterSchema, user_id: ObjectIdStr | None = None
    ):
        pipeline = [
            {
                "$match": {"linkMAL": {"$not": {"$eq": None}}},
            },
            *filtrado_tipos(filters.tiposAnime, True),
            *filtro_emision(filters.emision, "emision"),
            *filtrado_busqueda_avanzada_anime(filters),
            *lookup_user_favorites(
                user_id if user_id else None,
                "anime",
                "utafavs",
                filters.onlyFavs,
                filters.statusView,
            ),
        ]
        # Obtenemos el conteo de los animes que concuerdan con la busqueda
        totalAnimes = await AnimeModel.aggregate([*pipeline, {"$count": "totalAnimes"}])

        totalAnimes = totalAnimes[0]["totalAnimes"] if len(totalAnimes) > 0 else 0
        # Aplicamos la limitacion a la busqueda
        pipeline.extend(
            apply_paginacion_ordenacion(
                filters.limit, filters.page, filters.orderBy, filters.orderField, True
            )
        )

        logger.debug(pipeline)
        results = (
            await AnimeModel.aggregate(pipeline)
            if totalAnimes
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )
        return results, totalAnimes

    @staticmethod
    async def get_anime_by_key(key_anime: int, user_id: ObjectIdStr | None = None):
        pipeline = [
            {
                "$match": {"key_anime": key_anime},
            },
            *get_full_anime(),
            *lookup_user_favorites(
                user_id if user_id else None, "anime", "utafavs", False, 5
            ),
        ]
        result = await AnimeModel.aggregate(pipeline)
        return result[0] if len(result) > 0 else None

    @staticmethod
    async def get_anime_by_id(anime_id: ObjectIdStr):
        return await AnimeModel.find_by_id(ObjectId(anime_id))

    @staticmethod
    async def get_anime_by_id_MAL(id_MAL: int):
        return await AnimeModel.find_one({"id_MAL": id_MAL})

    @staticmethod
    async def get_anime_to_update_mal(anime_id: ObjectIdStr):
        return await AnimeModel.find_one(
            {"_id": ObjectId(anime_id), "id_MAL": {"$not": {"$eq": None}}}
        )

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
            *filtrado_tipos(filters.tiposAnime, True),
            *filtrado_busqueda_avanzada_anime(filters),
        ]
        # Obtenemos el conteo de los animes que tienen su informacion incompleta
        totalAnimes = await AnimeModel.aggregate([*pipeline, {"$count": "totalAnimes"}])

        totalAnimes = totalAnimes[0]["totalAnimes"] if len(totalAnimes) > 0 else 0
        # Aplicamos la limitacion a la busqueda
        pipeline.extend(
            apply_paginacion_ordenacion(
                filters.limit, filters.page, filters.orderBy, filters.orderField, True
            )
        )
        logger.debug(pipeline)
        results = (
            await AnimeModel.aggregate(pipeline)
            if totalAnimes
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        return results, totalAnimes

    @staticmethod
    async def get_all_ready_to_mal():
        return await AnimeModel.aggregate(filtrado_info_incompleta(True))

    @staticmethod
    async def get_studios(filters: FilterGSAESchema):
        pipeline = [filtrado_gsae(filters.txtSearch, True)]
        logger.debug(pipeline)
        studios = await StudioModel.aggregate(
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

        totalStudios = await StudioModel.aggregate(
            [*pipeline, {"$count": "totalStudios"}]
        )
        totalStudios = totalStudios[0]["totalStudios"] if len(totalStudios) > 0 else 0

        return studios, totalStudios

    @staticmethod
    async def is_exists_to_update(anime_id: ObjectIdStr, payload: AnimeUpdateSchema):
        k_anime_query = {"key_anime": payload.key_anime} if payload.key_anime else None
        id_mal_query = {"id_MAL": payload.id_MAL} if payload.id_MAL else None
        or_query = None
        if payload.id_MAL and payload.key_anime:
            k_anime_query = {"key_anime": payload.key_anime}
            id_mal_query = {"id_MAL": payload.id_MAL}
            or_query = {"$or": [k_anime_query, id_mal_query]}
        result = await AnimeModel.aggregate(
            [
                {
                    "$match": {
                        "$and": [
                            (
                                or_query
                                if or_query
                                else (k_anime_query if k_anime_query else id_mal_query)
                            ),
                            {"_id": {"$not": {"$eq": ObjectId(anime_id)}}},
                        ]
                    }
                }
            ]
        )

        return result and len(result) > 0

    @staticmethod
    async def find_keys_in_list(key_list: List[int]) -> List[int]:
        pipeline = [
            {"$match": {"key_anime": {"$in": key_list}}},
            {"$project": {"_id": 0, "key_anime": 1}},
        ]
        results = await AnimeModel.aggregate(pipeline)
        return [r.get("key_anime") for r in results]
