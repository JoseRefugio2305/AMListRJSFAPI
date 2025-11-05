from pydantic import BaseModel
from typing import List

from app.schemas.anime import AnimeSchema
from app.schemas.manga import MangaSchema


# Respuesta de lista de animes
class AnimeSearchSchema(BaseModel):
    listaAnimes: List[AnimeSchema] = []
    totalAnimes: int = 0
    page: int = 1
    totalPages: int = 1


# Respuesta de lista de mangas
class MangaSearchSchema(BaseModel):
    listaMangas: List[MangaSchema] = []
    totalMangas: int = 0
    page: int = 1
    totalPages: int = 1


class SearchAllSchema(AnimeSearchSchema, MangaSearchSchema):
    pass
