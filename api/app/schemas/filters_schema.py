from pydantic import BaseModel, Field
from typing import Optional
from enum import IntEnum

from app.schemas.anime_schema import StatusViewEnum, TipoAnimeEnum


class EmisionFilterEnum(IntEnum):
    finalizado = 0
    emision = 1 #En los mangas esto seria publicando
    pusado = 2
    todos = 3


# Schema de los filtros de paginado y busqueda
class FilterSchema(BaseModel):
    limit: int = Field(..., ge=1, le=20)
    skip: int = Field(..., ge=0)
    emision: EmisionFilterEnum = EmisionFilterEnum.todos
    onlyFavs: bool = False
    statusView: StatusViewEnum = StatusViewEnum.ninguno
    tipoAnime: TipoAnimeEnum = TipoAnimeEnum.desconocido
