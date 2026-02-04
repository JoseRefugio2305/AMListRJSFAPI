from app.schemas.search import FilterGSAESchema
from app.schemas.common.genres import CreateGenreSchema
from ..pipeline_builders.common import (
    apply_paginacion_ordenacion,
    filtrado_gsae,
)
from app.core.utils import time_now_formatted
from app.models.genero_model import GeneroModel
from app.core.logging import get_logger

logger = get_logger(__name__)


class GenreRepository:
    @staticmethod
    async def get_genres(filters: FilterGSAESchema):
        pipeline = [filtrado_gsae(filters.txtSearch, True)]
        logger.debug(pipeline)
        generos = await GeneroModel.aggregate(
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
        totalGeneros = await GeneroModel.aggregate(
            [*pipeline, {"$count": "totalGeneros"}]
        )
        totalGeneros = totalGeneros[0]["totalGeneros"] if len(totalGeneros) > 0 else 0

        return generos, totalGeneros

    @staticmethod
    async def create_genre(genre: CreateGenreSchema):
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

        return new_genre
