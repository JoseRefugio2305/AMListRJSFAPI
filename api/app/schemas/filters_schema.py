from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated, List
from enum import IntEnum

from app.schemas.anime_schema import (
    StatusViewEnum,
    TipoAnimeEnum,
)
from app.schemas.manga_schema import (
    TipoMangaEnum,
)
from app.core.utils import str_trim_lower


# Estado de emision/publicacion para filtrado
class EmisionFilterEnum(IntEnum):
    finalizado = 0
    emision = 1  # En los mangas esto seria publicando
    pusado = 2  # En hiatus manga
    todos = 3


# Tipo de contenido Anime/Manga/Todos
class TipoContenidoEnum(IntEnum):
    anime = 1
    manga = 2
    todos = 3


# Schema de los filtros de paginado y busqueda
class FilterSchema(BaseModel):
    limit: int = Field(..., ge=1, le=20)
    skip: int = Field(..., ge=0)
    emision: EmisionFilterEnum = (
        EmisionFilterEnum.todos
    )  # Sera publicando para los mangas
    onlyFavs: bool = False
    statusView: StatusViewEnum = StatusViewEnum.ninguno
    tiposAnime: List[TipoAnimeEnum] = [TipoAnimeEnum.desconocido]
    tiposManga: List[TipoMangaEnum] = [TipoMangaEnum.desconocido]
    tituloBusq: Annotated[Optional[str], BeforeValidator(str_trim_lower)] = Field(
        default="", max_length=20
    )
    animeEstudios: List[int] = []
    mangaEditoriales: List[int] = []
    mangaAutores: List[int] = []
    generos: List[int] = []
    tipoContenido: TipoContenidoEnum = TipoContenidoEnum.todos
