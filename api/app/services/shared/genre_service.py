import math

from app.schemas.common.genres import GenreSchema
from app.schemas.search import FilterGSAESchema, SearchGenresSchema
from app.core.utils import objects_id_list_to_str
from app.repositories.shared.genre_repository import GenreRepository
from app.schemas.common.genres import CreateGenreSchema
from app.schemas.anime import RespUpdMALAnimeSchema
from app.core.logging import get_logger

logger = get_logger(__name__)


class GenreService:
    # Busqueda de generos
    @staticmethod
    async def genres_list(filters: FilterGSAESchema) -> SearchGenresSchema:
        generos, totalGeneros = await GenreRepository.get_genres(filters)

        generos = objects_id_list_to_str(generos)

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

    # Insertar/Actualizar genero
    @staticmethod
    async def create_genre(genre: CreateGenreSchema) -> RespUpdMALAnimeSchema:
        try:
            # Si encuentra el genero actualiza la informacion, si no lo encuentra al insertar agrega el id_MAL y la fecha de adicion
            new_genre = await GenreRepository.create_genre(genre)
            return RespUpdMALAnimeSchema(
                message="Genero Creado Correctamente", is_success=True
            )
        except Exception as e:
            logger.error(f"Error: {e}", exc_info=True)
            return RespUpdMALAnimeSchema(
                message="Ocurrio un error al intentar agregar el genero",
                is_success=False,
            )
