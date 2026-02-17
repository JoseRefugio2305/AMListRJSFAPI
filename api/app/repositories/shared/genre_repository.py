from app.schemas.search import FilterGSAESchema
from app.schemas.common.genres import CreateGenreSchema
from ..pipeline_builders.common import (
    apply_paginacion_ordenacion,
    filtrado_gsae,
)
from app.core.cache.cache_manager import cache_manager
from app.models.genero_model import GeneroModel
from app.core.logging import get_logger

logger = get_logger(__name__)


class GenreRepository:
    @staticmethod
    async def get_genres(filters: FilterGSAESchema):
        pipeline = [filtrado_gsae(filters.txtSearch, True)]
        pipeline = [
            {
                "$facet": {
                    "totales": [*pipeline, {"$count": "totalGeneros"}],
                    "generos": [
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
        results = await GeneroModel.aggregate(pipeline).to_list()
        totalGeneros = (
            results[0]["totales"][0]["totalGeneros"]
            if len(results[0]["totales"]) > 0
            else 0
        )

        return results[0]["generos"], totalGeneros

    @staticmethod
    async def create_genre(genre: CreateGenreSchema):
        # Si encuentra el genero actualiza la informacion, si no lo encuentra al insertar agrega el id_MAL y la fecha de adicion
        new_genre = await GeneroModel.find_one(
            GeneroModel.id_MAL == genre.id_MAL
        ).upsert(
            {
                "$set": {
                    "nombre": genre.nombre,
                    "nombre_mal": genre.nombre_mal,
                    "linkMAL": genre.linkMAL,
                }
            },
            on_insert=GeneroModel(**genre.model_dump()),
        )

        await cache_manager.invalidate_filters()
        await cache_manager.invalidate_search()  # Invalidamos el cache de busqueda para evitar discrepancias al haber un nuevo genero

        return new_genre
