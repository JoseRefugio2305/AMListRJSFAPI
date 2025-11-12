from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated, List
from .filters_enum import EmisionFilterEnum, TipoContenidoEnum, ActiveUserEnum

from app.schemas.anime import (
    StatusViewEnum,
    TipoAnimeEnum,
)
from app.schemas.manga import (
    TipoMangaEnum,
)
from app.core.utils import str_trim_lower


# Schema de los filtros de paginado y busqueda
class FilterSchema(BaseModel):
    limit: int = Field(20, ge=1, le=20)
    page: int = Field(1, ge=1)
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


# Schema de filtros para busqueda de usuarios en dashboard
class UserListFilterSchema(BaseModel):
    limit: int = Field(20, ge=1, le=20)
    page: int = Field(1, ge=1)
    txtSearch: Annotated[Optional[str], BeforeValidator(str_trim_lower)] = Field(
        default="", max_length=20
    )
    is_active: ActiveUserEnum = ActiveUserEnum.todos
