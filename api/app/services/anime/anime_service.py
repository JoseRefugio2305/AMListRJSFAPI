from fastapi import HTTPException, status
from typing import Optional
import math

from app.models.anime_model import AnimeModel
from app.models.genero_model import GeneroModel
from app.models.studio_model import StudioModel
from app.schemas.anime import AnimeSchema
from app.schemas.common.relations import StudiosSchema
from app.schemas.common.genres import GenreSchema
from .anime_utils import dict_to_anime_schema, dict_to_incomplete_anime
from app.schemas.search import (
    AnimeSearchSchema,
    FilterSchema,
    SearchAnimeIncompleteSchema,
    ReadyToMALEnum,
    FilterGSAESchema,
    SearchGenresSchema,
    SearchStudiosSchema,
)
from app.schemas.auth import UserLogRespSchema
from app.core.utils import object_id_to_str, objects_id_list_to_str
from app.core.database import (
    lookup_user_favorites,
    filtro_emision,
    filtrado_tipos,
    filtrado_busqueda_avanzada_anime,
    apply_paginacion_ordenacion,
    get_full_anime,
    filtrado_gsae,
)
from app.core.logging import get_logger

logger = get_logger(__name__)


class AnimeService:

    # Encontrar la lista de animes por pagina de busqueda, solo se obtendran los que estan finalizados
    @staticmethod
    async def get_all(
        filters: FilterSchema, user: Optional[UserLogRespSchema] = None
    ) -> AnimeSearchSchema:
        pipeline = [
            {
                "$match": {"linkMAL": {"$not": {"$eq": None}}},
            },
            *filtrado_tipos(filters.tiposAnime, True),
            *filtro_emision(filters.emision, "emision"),
            *filtrado_busqueda_avanzada_anime(filters),
            *lookup_user_favorites(
                user.id if user else None,
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
            objects_id_list_to_str(await AnimeModel.aggregate(pipeline))
            if totalAnimes
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        return AnimeSearchSchema(
            listaAnimes=[
                dict_to_anime_schema(r, True if user else False, False) for r in results
            ],
            pageA=filters.page,
            totalPagesA=math.ceil(totalAnimes / filters.limit),
            totalAnimes=totalAnimes,
        )

    # Detalles del anime
    @staticmethod
    async def get_anime_by_id(
        key_anime: int, user: Optional[UserLogRespSchema] = None
    ) -> AnimeSchema:
        pipeline = [
            {
                "$match": {"key_anime": key_anime},
            },
            *get_full_anime(),
            *lookup_user_favorites(
                user.id if user else None, "anime", "utafavs", False, 5
            ),
        ]
        results = await AnimeModel.aggregate(pipeline)

        if len(results) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Anime no encontrado",
            )
        anime = object_id_to_str(
            results[0]
        )  # Agregate retorna por defecto una lista, por lo cual se debe de tomar el primer elemento, si no da resultados, seria un elemento vacio
        return dict_to_anime_schema(anime, True if user else False, True)

    # Obtener los animes que no estan actualizados con su informaicon de MAL
    @staticmethod
    async def get_incomplete_animes(
        filters: FilterSchema, ready_to_mal: ReadyToMALEnum = ReadyToMALEnum.todos
    ) -> SearchAnimeIncompleteSchema:
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
        results = (
            objects_id_list_to_str(await AnimeModel.aggregate(pipeline))
            if totalAnimes
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        results = [dict_to_incomplete_anime(a) for a in results]

        logger.debug(pipeline)

        return SearchAnimeIncompleteSchema(
            listaAnimes=results,
            totalAnimes=totalAnimes,
            totalPages=math.ceil(totalAnimes / filters.limit),
            page=filters.page,
        )

    # Busqueda de generos
    @staticmethod
    async def genres_list(filters: FilterGSAESchema) -> SearchGenresSchema:
        pipeline = [filtrado_gsae(filters.txtSearch, True)]
        logger.debug(pipeline)
        generos = objects_id_list_to_str(
            await GeneroModel.aggregate(
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
        )
        totalGeneros = await GeneroModel.aggregate(
            [*pipeline, {"$count": "totalGeneros"}]
        )
        totalGeneros = totalGeneros[0]["totalGeneros"] if len(totalGeneros) > 0 else 0

        list_generos = [
            GenreSchema(
                nombre=gen.get("nombre"),
                id=gen.get("_id") or gen.get("id") or gen.get("Id"),
                id_MAL=gen.get("id_MAL"),
                nombre_mal=gen.get("nombre_mal"),
                linkMAL=gen.get("linkMAL"),
                fechaAdicion=gen.get("fechaAdicion"),
            )
            for gen in generos
        ]

        return SearchGenresSchema(
            lista=list_generos,
            total=totalGeneros,
            page=filters.page,
            totalPages=math.ceil(totalGeneros / filters.limit),
        )

    # Busqueda de estudios de animacion
    @staticmethod
    async def studios_list(filters: FilterGSAESchema) -> SearchStudiosSchema:
        pipeline = [filtrado_gsae(filters.txtSearch, True)]
        logger.debug(pipeline)
        studios = objects_id_list_to_str(
            await StudioModel.aggregate(
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
        )
        totalStudios = await StudioModel.aggregate(
            [*pipeline, {"$count": "totalStudios"}]
        )
        totalStudios = totalStudios[0]["totalStudios"] if len(totalStudios) > 0 else 0

        list_Studios = [
            StudiosSchema(
                nombre=std.get("nombre"),
                id=std.get("_id") or std.get("id") or std.get("Id"),
                id_MAL=std.get("id_MAL"),
                linkMAL=std.get("linkMAL"),
                fechaAdicion=str(std.get("fechaAdicion")),
            )
            for std in studios
        ]

        return SearchStudiosSchema(
            lista=list_Studios,
            total=totalStudios,
            page=filters.page,
            totalPages=math.ceil(totalStudios / filters.limit),
        )
