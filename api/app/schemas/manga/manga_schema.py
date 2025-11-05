from pydantic import BaseModel, Field, HttpUrl, ConfigDict, AliasChoices
from typing import Optional, List
from .manga_enums import TipoMangaEnum
from app.schemas.anime import (
    StatusViewEnum,
    EstadoEmEnum,
    GenreARelSchema,
    AltTitlesSchema,
    PATTERN_ID,
)


# Imagenes de los mangas
class MangaImagesSchema(BaseModel):
    img_sm: HttpUrl
    img_l: HttpUrl


# Relacion de autores de manga
class AutoresMRelSchema(BaseModel):
    nombre: str
    id_MAL: int


# Relacion editorial de manga
class EditorialMRelSchema(BaseModel):
    nombre: str
    id_MAL: int


# Relacion de adaptaciones del manga
class AdaptacionSchema(BaseModel):
    titulo: str = Field(validation_alias=AliasChoices("titulo", "nombre"))
    id_MAL: int


# Relaciones del manga
class MangaRelationsSchema(BaseModel):
    titulo: str = Field(validation_alias=AliasChoices("titulo", "nombre"))
    id_MAL: int


# Tipos de mangas (manga, NL, one-shot, etc.)
class MangaTypesSchema(BaseModel):
    id: str = Field(..., pattern=PATTERN_ID)
    code: int = Field(..., ge=1, le=6)
    nombre: str
    fechaAdicion: str


# Schema para la creacion del manga por el administrador
class MangaCreateSchema(BaseModel):
    key_manga: int = Field(..., ge=1)
    titulo: str = Field(...)
    link_p: HttpUrl = Field(...)
    tipo: TipoMangaEnum = Field(...)


# Manga
class MangaSchema(MangaCreateSchema):
    id: str = Field(..., pattern=PATTERN_ID)
    mangaImages: List[MangaImagesSchema]
    calificacion: float = Field(ge=0, le=10)
    descripcion: str
    publicando: EstadoEmEnum
    capitulos: float = Field(..., ge=0)
    volumenes: int = Field(..., ge=0)
    fechaAdicion: str
    fechaComienzoPub: str
    fechaFinPub: str
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
    mangaImages: List[MangaImagesSchema]
    calificacion: float = Field(ge=0, le=10)
    descripcion: str
    publicando: EstadoEmEnum
    capitulos: float = Field(..., ge=0)
    volumenes: int = Field(..., ge=0)
    fechaComienzoPub: str
    fechaFinPub: str
    generos: List[GenreARelSchema]
    linkMAL: HttpUrl
    numRatings: int = Field(..., ge=0)
    relaciones: Optional[List[MangaRelationsSchema]] = None
    editoriales: List[EditorialMRelSchema]
    autores: List[AutoresMRelSchema]
    adaptaciones: Optional[List[AdaptacionSchema]] = None
    titulos_alt: Optional[List[AltTitlesSchema]] = None
