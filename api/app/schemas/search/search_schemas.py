from pydantic import BaseModel, Field, BeforeValidator
from typing import List,Annotated

from app.schemas.anime import AnimeSchema, AnimeMALSearch
from app.schemas.manga import MangaSchema
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
    tit_search: Annotated[str, BeforeValidator(str_trim_lower)]=Field(...,min_length=5)


# Respuesta de busqueda de anime en MAL por titulo
class ResponseSearchAnimeMAL(BaseModel):
    listaAnimes: List[AnimeMALSearch] = Field([], max_length=10)
    totalResults: int = 0
