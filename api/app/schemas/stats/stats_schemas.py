from pydantic import BaseModel
from typing import List
from enum import IntEnum

from app.schemas.anime import (
    StatusViewEnum,
    TipoAnimeEnum,
)
from app.schemas.manga import (
    TipoMangaEnum,
)


class TypeStatisticEnum(IntEnum):
    a_m_favs = 1
    tipo_a_m = 2
    generos = 3
    studios = 4
    editorials = 5


# Conteo de anime y manga por estado de visualizacion
class StatusViewCountSchema(BaseModel):
    statusView: StatusViewEnum
    conteo: int


# Schema Conteo de tipos de anime
class StatsTipoAnimeSchema(BaseModel):
    code: TipoAnimeEnum
    conteo: int = 0
    nombre: str


# Schema conteo de tipos de manga
class StatsTipoMangaSchema(BaseModel):
    code: TipoMangaEnum
    conteo: int = 0
    nombre: str


# Schema conteo de animes y mangas por genero
class StatsGeneroSchema(BaseModel):
    id_MAL: int
    nombre: str
    conteomangas: int = 0
    conteoanimes: int = 0


# Schema de top studios de anime con mas producciones
class TopStudiosSchema(BaseModel):
    id_MAL: int
    nombre: str
    conteoanimes: int = 0


# Schema de top editoriales de manga con mas publicaciones
class TopEditorialsSchema(BaseModel):
    id_MAL: int
    nombre: str
    conteomangas: int = 0


class StatsSchema(BaseModel):
    tiposAnime: List[StatsTipoAnimeSchema] = []
    tiposManga: List[StatsTipoMangaSchema] = []
    conteoGeneros: List[StatsGeneroSchema] = []
    topStudios: List[TopStudiosSchema] = []
    topEditorials: List[TopEditorialsSchema] = []


# Schema del conteo general de animes y mangas favoritos
class FavsCountSchema(StatsSchema):
    totalAnimes: int = 0
    conteos_statusA: List[StatusViewCountSchema] = []  # Conteo por statusview de animes
    totalMangas: int = 0
    conteos_statusM: List[StatusViewCountSchema] = []  # Conteo por statusview de mangas
