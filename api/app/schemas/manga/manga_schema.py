from pydantic import BaseModel, Field, HttpUrl, ConfigDict, AfterValidator
from typing import Optional, List, Annotated
from .manga_enums import TipoMangaEnum
from app.schemas.common.relations import (
    AltTitlesSchema,
    EditorialMRelSchema,
    AutoresMRelSchema,
    AdaptacionFullSchema,
    AdaptacionSchema,
    MangaRelTypeFullSchema,
    MangaRelTypeIncompleteSchema,
)
from app.schemas.common.images import MediaImagesSchema
from app.schemas.common.genres import GenreARelSchema
from app.schemas.anime import AnimeMALSearch, EstadoEmEnum, StatusViewEnum
from app.core.utils import httpurl_to_str, ObjectIdStr


# Schema para la creacion del manga por el administrador
class MangaCreateSchema(BaseModel):
    key_manga: int = Field(..., ge=1)
    titulo: str = Field(...)
    link_p: Annotated[HttpUrl, AfterValidator(httpurl_to_str)] = Field(
        ...
    )  # La conversion posterior es necesaria para que al serializar antes de insertar no de errores al intentar serializar HttpUrl como string
    tipo: TipoMangaEnum = Field(TipoMangaEnum.manga)


# Schema para la consulta de mangas que tienen su informacion incompleta
class MangaIncompleteSchema(MangaCreateSchema):
    id: ObjectIdStr
    id_MAL: Optional[int] = None


# Manga
class MangaSchema(MangaCreateSchema):
    id: ObjectIdStr
    mangaImages: MediaImagesSchema
    calificacion: float = Field(ge=0, le=10)
    descripcion: str
    publicando: EstadoEmEnum
    capitulos: float = Field(..., ge=0)
    volumenes: int = Field(..., ge=0)
    fechaAdicion: str
    fechaComienzoPub: str
    fechaFinPub: Optional[str] = None
    generos: Optional[List[GenreARelSchema]] = None
    id_MAL: int
    linkMAL: HttpUrl
    numRatings: int = Field(..., ge=0)
    relaciones: Optional[List[MangaRelTypeFullSchema]] = None
    editoriales: Optional[List[EditorialMRelSchema]] = None
    autores: Optional[List[AutoresMRelSchema]] = None
    adaptaciones: Optional[List[AdaptacionFullSchema]] = None
    titulos_alt: Optional[List[AltTitlesSchema]] = None
    isFav: Optional[bool] = None
    statusView: Optional[StatusViewEnum] = None

    model_config = ConfigDict(from_attributes=True)


# Actualizacion del manga por el administrador
class MangaUpdateSchema(MangaCreateSchema):
    key_manga: Optional[int] = None
    id_MAL: Optional[int] = None
    titulo: Optional[str] = None
    link_p: Optional[Annotated[HttpUrl, AfterValidator(httpurl_to_str)]] = None
    tipo: Optional[TipoMangaEnum] = None
    mangaImages: Optional[MediaImagesSchema] = None
    calificacion: Optional[float] = Field(default=0, ge=0, le=10)
    descripcion: Optional[str] = None
    publicando: Optional[EstadoEmEnum] = None
    capitulos: Optional[float] = Field(default=None, ge=0)
    volumenes: Optional[int] = Field(default=None, ge=0)
    fechaComienzoPub: Optional[str] = None
    fechaFinPub: Optional[str] = None
    generos: Optional[List[GenreARelSchema]] = None
    linkMAL: Optional[Annotated[HttpUrl, AfterValidator(httpurl_to_str)]] = None
    numRatings: Optional[int] = Field(default=0, ge=0)
    relaciones: Optional[List[MangaRelTypeIncompleteSchema]] = None
    editoriales: Optional[List[EditorialMRelSchema]] = None
    autores: Optional[List[AutoresMRelSchema]] = None
    adaptaciones: Optional[List[AdaptacionSchema]] = None
    titulos_alt: Optional[List[AltTitlesSchema]] = None


# Respuesta manga creado, actualizado
class ResponseUpdCrtManga(BaseModel):
    message: str


# Respuesta manga actualizado desde MAL
class RespUpdMALMangaSchema(ResponseUpdCrtManga):
    is_success: bool


# Esquema para las respuestas de mangas en MAL por titulo
class MangaMALSearch(AnimeMALSearch):
    tipo: str = "Manga"


# Asignar id_MAL a un manga
class PayloadMangaIDMAL(BaseModel):
    id: ObjectIdStr
    id_MAL: int = Field(..., ge=1)