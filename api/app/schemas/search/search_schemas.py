from pydantic import BaseModel, Field, BeforeValidator
from typing import List, Annotated

from app.schemas.anime import AnimeSchema, AnimeMALSearch, AnimeIncompleteSchema
from app.schemas.manga import MangaSchema, MangaMALSearch, MangaIncompleteSchema
from app.schemas.common.genres import GenreSchema
from app.schemas.common.relations import StudiosSchema, AutorSchema, EditorialSchema
from app.core.utils import str_trim_lower


# Respuesta de lista de animes
class AnimeSearchSchema(BaseModel):
    listaAnimes: List[AnimeSchema] = []
    totalAnimes: int = 0
    pageA: int = 1
    totalPagesA: int = 1


# Respuesta de lista de mangas
class MangaSearchSchema(BaseModel):
    listaMangas: List[MangaSchema] = []
    totalMangas: int = 0
    pageM: int = 1
    totalPagesM: int = 1


# Respuesta de busqueda general
class SearchAllSchema(AnimeSearchSchema, MangaSearchSchema):
    pass


# Payload busqueda de anime en MAL por titulo
class PayloadSearchAnimeMAL(BaseModel):
    tit_search: Annotated[str, BeforeValidator(str_trim_lower)] = Field(
        ..., min_length=4
    )

# Payload busqueda de manga en MAL por titulo
class PayloadSearchMangaMAL(BaseModel):
    tit_search: Annotated[str, BeforeValidator(str_trim_lower)] = Field(
        ..., min_length=4
    )


# Respuesta de busqueda de anime en MAL por titulo
class ResponseSearchAnimeMAL(BaseModel):
    listaAnimes: List[AnimeMALSearch] = Field([], max_length=10)
    totalResults: int = 0


# Schema de respuesta para la busqueda de animes con la informacion sin actualizar
class SearchAnimeIncompleteSchema(BaseModel):
    listaAnimes: List[AnimeIncompleteSchema]
    totalAnimes: int = 0
    page: int = 1
    totalPages: int = 1


# Respuesta de busqueda de manga en MAL por titulo
class ResponseSearchMangaMAL(BaseModel):
    listaMangas: List[MangaMALSearch] = Field([], max_length=10)
    totalResults: int = 0


# Schema de respuesta para la busqueda de mangas con la informacion sin actualizar
class SearchMangaIncompleteSchema(BaseModel):
    listaMangas: List[MangaIncompleteSchema]
    totalMangas: int = 0
    page: int = 1
    totalPages: int = 1


# Schema de resultado de busqueda de generos
class SearchGenresSchema(BaseModel):
    lista: List[GenreSchema]
    total: int = 0
    page: int = 1
    totalPages: int = 1


# Schema de resultado de busqueda de estudios de animacion
class SearchStudiosSchema(SearchGenresSchema):
    lista: List[StudiosSchema]


# Schema de resultado de busqueda de autores de manga
class SearchAutoresSchema(SearchGenresSchema):
    lista: List[AutorSchema]


# Schema de resultado de busqueda de editoriales de manga
class SearchEditorialsSchema(SearchGenresSchema):
    lista: List[EditorialSchema]
