from app.schemas.search import FiltersListAdvancedSearch
from app.schemas.common.genres import GenreARelSchema
from app.schemas.common.relations import (
    StudiosARelSchema,
    EditorialMRelSchema,
    AutoresMRelSchema,
)
from app.models.genero_model import GeneroModel
from app.models.studio_model import StudioModel
from app.models.editorial_model import EditorialModel
from app.models.author_model import AuthorModel
from app.core.utils import objects_id_list_to_str


def dict_to_search_schema(dictFilter: dict) -> dict:
    return {"nombre": dictFilter["nombre"], "id_MAL": dictFilter["id_MAL"]}


class SearchService:
    # Obtener los generos, autores, estudios de animacion y editoriales de manga para los filtros en la busqueda
    @staticmethod
    async def get_filters() -> FiltersListAdvancedSearch:
        lista_generos = objects_id_list_to_str(await GeneroModel.find({}))
        lista_studios = objects_id_list_to_str(await StudioModel.find({}))
        lista_editoriales = objects_id_list_to_str(await EditorialModel.find({}))
        lista_autores = objects_id_list_to_str(await AuthorModel.find({}))

        return FiltersListAdvancedSearch(
            genresList=[
                GenreARelSchema(nombre=gl["nombre_mal"], id_MAL=gl["id_MAL"])
                for gl in lista_generos
            ],
            studiosList=[
                StudiosARelSchema(nombre=gl["nombre"], id_MAL=gl["id_MAL"])
                for gl in lista_studios
            ],
            editorialesList=[
                EditorialMRelSchema(nombre=gl["nombre"], id_MAL=gl["id_MAL"])
                for gl in lista_editoriales
            ],
            autoresList=[
                AutoresMRelSchema(nombre=gl["nombre"], id_MAL=gl["id_MAL"])
                for gl in lista_autores
            ],
        )
