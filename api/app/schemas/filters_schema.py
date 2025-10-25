from pydantic import BaseModel, Field
from enum import IntEnum

from app.schemas.anime_schema import StatusViewEnum, TipoAnimeEnum
from app.schemas.manga_schema import TipoMangaEnum


class EmisionFilterEnum(IntEnum):
    finalizado = 0
    emision = 1  # En los mangas esto seria publicando
    pusado = 2  # En hiatus manga
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
    tipoAnime: TipoAnimeEnum = TipoAnimeEnum.desconocido
    tipoManga: TipoMangaEnum = TipoMangaEnum.desconocido
