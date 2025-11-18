from pydantic import BaseModel, Field, HttpUrl, ConfigDict, AliasChoices, AfterValidator
from typing import Optional, List, Annotated
from .manga_enums import TipoMangaEnum
from app.schemas.anime import (
    StatusViewEnum,
    EstadoEmEnum,
    GenreARelSchema,
    AltTitlesSchema,
    AnimeMALSearch,
)
from app.core.utils import httpurl_to_str, ObjectIdStr


# Imagenes de los mangas
class MangaImagesSchema(BaseModel):
    img_sm: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]
    img: Optional[Annotated[HttpUrl, AfterValidator(httpurl_to_str)]] = None
    img_l: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]


# Relacion de autores de manga
class AutoresMRelSchema(BaseModel):
    nombre: str
    id_MAL: int


# Esuqema de creacion de autor
class CreateAutorSchema(AutoresMRelSchema):
    tipo: str
    linkMAL: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]


# Relacion editorial de manga
class EditorialMRelSchema(BaseModel):
    nombre: str
    id_MAL: int


# Esquema de creacion de Editorial
class CreateEditorialSchema(EditorialMRelSchema):
    tipo: str
    linkMAL: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]


# Relacion de adaptaciones del manga
class AdaptacionSchema(BaseModel):
    titulo: str = Field(validation_alias=AliasChoices("titulo", "nombre"))
    id_MAL: int


# Relaciones del manga
class MangaRelationsSchema(BaseModel):
    titulo: str = Field(validation_alias=AliasChoices("titulo", "nombre"))
    id_MAL: int
    type_rel: Optional[str] = None


# Tipos de mangas (manga, NL, one-shot, etc.)
class MangaTypesSchema(BaseModel):
    id: ObjectIdStr
    code: int = Field(..., ge=1, le=6)
    nombre: str
    fechaAdicion: str


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
    mangaImages: List[MangaImagesSchema]
    calificacion: float = Field(ge=0, le=10)
    descripcion: str
    publicando: EstadoEmEnum
    capitulos: float = Field(..., ge=0)
    volumenes: int = Field(..., ge=0)
    fechaAdicion: str
    fechaComienzoPub: str
    fechaFinPub: Optional[str] = None
    generos: List[GenreARelSchema]
    id_MAL: int
    linkMAL: HttpUrl
    numRatings: int = Field(..., ge=0)
    relaciones: Optional[List[MangaRelationsSchema]] = None
    editoriales: List[EditorialMRelSchema]
    autores: List[AutoresMRelSchema]
    adaptaciones: List[AdaptacionSchema]
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
    mangaImages: Optional[List[MangaImagesSchema]] = None
    calificacion: Optional[float] = Field(default=None, ge=0, le=10)
    descripcion: Optional[str] = None
    publicando: Optional[EstadoEmEnum] = None
    capitulos: Optional[float] = Field(default=None, ge=0)
    volumenes: Optional[int] = Field(default=None, ge=0)
    fechaComienzoPub: Optional[str] = None
    fechaFinPub: Optional[str] = None
    generos: Optional[List[GenreARelSchema]] = None
    linkMAL: Optional[Annotated[HttpUrl, AfterValidator(httpurl_to_str)]] = None
    numRatings: Optional[int] = Field(default=None, ge=0)
    relaciones: Optional[List[MangaRelationsSchema]] = None
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
