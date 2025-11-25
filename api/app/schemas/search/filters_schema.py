from pydantic import BaseModel, Field, BeforeValidator
from typing import Optional, Annotated, List
from .filters_enum import (
    EmisionFilterEnum,
    TipoContenidoEnum,
    ActiveUserEnum,
    OrderByEnum,
    FieldOrdEnum,
    UserTypeEnum,
    FieldOrdUsersEnum,
    FieldOrdGSAEEnum,
)

from app.schemas.anime import StatusViewEnum, TipoAnimeEnum
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
    orderBy: OrderByEnum = OrderByEnum.asc
    orderField: FieldOrdEnum = FieldOrdEnum.key


# Schema de filtros para busqueda de usuarios en dashboard
class UserListFilterSchema(BaseModel):
    limit: int = Field(20, ge=1, le=20)
    page: int = Field(1, ge=1)
    txtSearch: Annotated[Optional[str], BeforeValidator(str_trim_lower)] = Field(
        default="", max_length=20
    )
    userType: UserTypeEnum = UserTypeEnum.todos
    is_active: ActiveUserEnum = ActiveUserEnum.todos
    orderBy: OrderByEnum = OrderByEnum.asc
    orderField: FieldOrdUsersEnum = FieldOrdUsersEnum.name


# Schema de filtros de busqueda de generos, estudios de animacion, editoriales y autores
class FilterGSAESchema(BaseModel):
    limit: int = Field(20, ge=1, le=20)
    page: int = Field(1, ge=1)
    txtSearch: Annotated[Optional[str], BeforeValidator(str_trim_lower)] = Field(
        default="", max_length=20
    )
    orderBy: OrderByEnum = OrderByEnum.asc
    orderField: FieldOrdGSAEEnum = FieldOrdGSAEEnum.id_MAL
