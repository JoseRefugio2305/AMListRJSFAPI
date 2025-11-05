from pydantic import BaseModel, Field, HttpUrl, ConfigDict
from typing import Optional, List
from .anime_enums import EstadoEmEnum, TipoAnimeEnum,StatusViewEnum


PATTERN_ID = r"^([a-fA-F0-9]{24})$"


# Relacion de generos en animes y mangas
class GenreARelSchema(BaseModel):
    nombre: str
    id_MAL: int


# Generos
class GenreSchema(GenreARelSchema):
    id: str = Field(..., pattern=r"^([a-fA-F0-9]{24})$")
    nombre_mal: str
    linkMAL: HttpUrl
    fechaAdicion: str


# Imagenes de los animes
class AnimeImagesSchema(BaseModel):
    img_sm: HttpUrl
    img_l: HttpUrl


# Relacion de estudios en animes
class StudiosARelSchema(BaseModel):
    nombre: str
    id_MAL: int


# Estudios de Animacion
class StudiosSchema(StudiosARelSchema):
    id: str = Field(..., pattern=r"^([a-fA-F0-9]{24})$")
    linkMAL: HttpUrl
    fechaAdicion: str


# Tipos de animes (animes, OVA, ONA, etc.)
class AnimeTypesSchema(BaseModel):
    id: str = Field(..., pattern=r"^([a-fA-F0-9]{24})$")
    code: int = Field(..., ge=1, le=6)
    nombre: str
    fechaAdicion: str


# Relaciones del anime
class AnimeRelationsSchema(BaseModel):
    id_MAL: int
    titulo: str


# Titulos Alternaivos usado en manga tambien
class AltTitlesSchema(BaseModel):
    tit_alt: str
    tipo: str


# Schema para la creacion del anime por el administrador
class AnimeCreateSchema(BaseModel):
    key_anime: int = Field(..., ge=1)
    titulo: str = Field(...)
    link_p: HttpUrl = Field(...)
    tipo: TipoAnimeEnum = Field(...)


# Anime
class AnimeSchema(AnimeCreateSchema):
    id: str = Field(..., pattern=r"^([a-fA-F0-9]{24})$")
    animeImages: List[AnimeImagesSchema]
    calificacion: float = Field(ge=0, le=10)
    descripcion: str
    emision: EstadoEmEnum
    episodios: float = Field(..., ge=0)
    fechaAdicion: str
    fechaEmision: str
    generos: List[GenreARelSchema]
    id_MAL: int
    linkMAL: HttpUrl
    numRatings: int = Field(..., ge=0)
    relaciones: Optional[List[AnimeRelationsSchema]] = None
    studios: List[StudiosARelSchema]
    titulos_alt: Optional[List[AltTitlesSchema]] = None
    isFav: Optional[bool] = None
    statusView:Optional[StatusViewEnum]=None

    model_config = ConfigDict(from_attributes=True)


# Actualizacion del anime por el administrador
class AnimeUpdateSchema(AnimeCreateSchema):
    animeImages: List[AnimeImagesSchema]
    calificacion: float = Field(ge=0, le=10)
    descripcion: str
    emision: EstadoEmEnum
    episodios: float = Field(..., ge=0)
    fechaEmision: str
    generos: List[GenreARelSchema]
    linkMAL: HttpUrl
    numRatings: int = Field(..., ge=0)
    relaciones: Optional[List[AnimeRelationsSchema]] = None
    studios: List[StudiosARelSchema]
    titulos_alt: Optional[List[AltTitlesSchema]] = None
