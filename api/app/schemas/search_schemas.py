from pydantic import BaseModel, Field, HttpUrl, ConfigDict
from typing import List

from app.schemas.anime_schema import AnimeSchema
from app.schemas.manga_schema import MangaSchema


# Respuesta de lista de animes
class AnimeSearchSchema(BaseModel):
    listaAnimes: List[AnimeSchema] = []
    totalAnimes: int = 0

# Respuesta de lista de mangas
class MangaSearchSchema(BaseModel):
    listaMangas:List[MangaSchema]=[]
    totalMangas:int=0

class SearchAllSchema(AnimeSearchSchema, MangaSearchSchema):
    pass