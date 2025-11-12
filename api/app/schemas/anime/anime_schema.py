from pydantic import BaseModel, Field, HttpUrl, ConfigDict, AfterValidator, AliasChoices
from typing import Optional, List, Annotated
from .anime_enums import EstadoEmEnum, TipoAnimeEnum, StatusViewEnum
from app.core.utils import httpurl_to_str


PATTERN_ID = r"^([a-fA-F0-9]{24})$"


# Relacion de generos en animes y mangas
class GenreARelSchema(BaseModel):
    nombre: str
    id_MAL: int


# Schema para crear un genero
class CreateGenreSchema(GenreARelSchema):
    nombre_mal: str
    linkMAL: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]


# Generos
class GenreSchema(CreateGenreSchema):
    id: str = Field(..., pattern=r"^([a-fA-F0-9]{24})$")
    fechaAdicion: str


# Imagenes de los animes
class AnimeImagesSchema(BaseModel):
    img_sm: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]
    img_l: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]


# Relacion de estudios en animes
class StudiosARelSchema(BaseModel):
    nombre: str
    id_MAL: int


class CreateStudioSchema(StudiosARelSchema):
    linkMAL: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]
    fechaAdicion: str


# Estudios de Animacion
class StudiosSchema(CreateStudioSchema):
    id: str = Field(..., pattern=r"^([a-fA-F0-9]{24})$")


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
    type_rel: Optional[str] = None


# Titulos Alternaivos usado en manga tambien
class AltTitlesSchema(BaseModel):
    tit_alt: str
    tipo: str


# Schema para la creacion del anime por el administrador
class AnimeCreateSchema(BaseModel):
    key_anime: int = Field(..., ge=1)
    titulo: str = Field(...)
    link_p: Annotated[HttpUrl, AfterValidator(httpurl_to_str)] = Field(
        ...
    )  # La conversion posterior es necesaria para que al serializar antes de insertar no de errores al intentar serializar HttpUrl como string
    tipo: TipoAnimeEnum = Field(TipoAnimeEnum.anime)


# Respuesta anime creado, actualizado
class ResponseUpdCrtAnime(BaseModel):
    message: str


# Respuesta anime actualizado desde MAL
class RespUpdMALAnimeSchema(ResponseUpdCrtAnime):
    is_success: bool


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
    link_p: str  # En Este esquema se usa el link_p como string para evitar errores de conversion a HttpUrl
    numRatings: int = Field(..., ge=0)
    relaciones: Optional[List[AnimeRelationsSchema]] = None
    adaptaciones: Optional[List[AnimeRelationsSchema]] = None
    studios: List[StudiosARelSchema]
    titulos_alt: Optional[List[AltTitlesSchema]] = None
    isFav: Optional[bool] = None
    statusView: Optional[StatusViewEnum] = None

    model_config = ConfigDict(from_attributes=True)


# Actualizacion del anime por el administrador
class AnimeUpdateSchema(AnimeCreateSchema):
    key_anime: Optional[int] = None
    id_MAL: Optional[int] = None
    titulo: Optional[str] = None
    link_p: Optional[Annotated[HttpUrl, AfterValidator(httpurl_to_str)]] = None
    tipo: Optional[TipoAnimeEnum] = None
    animeImages: Optional[List[AnimeImagesSchema]] = None
    calificacion: Optional[float] = Field(default=None, ge=0, le=10)
    descripcion: Optional[str] = None
    emision: Optional[EstadoEmEnum] = None
    episodios: Optional[float] = Field(default=None, ge=0)
    fechaEmision: Optional[str] = None
    generos: Optional[List[GenreARelSchema]] = None
    linkMAL: Optional[Annotated[HttpUrl, AfterValidator(httpurl_to_str)]] = None
    numRatings: Optional[int] = Field(default=None, ge=0)
    relaciones: Optional[List[AnimeRelationsSchema]] = None
    adaptaciones: Optional[List[AnimeRelationsSchema]] = None
    studios: Optional[List[StudiosARelSchema]] = None
    titulos_alt: Optional[List[AltTitlesSchema]] = None


# Esquema para la respues de animes buscados en MAL por titulo
class AnimeMALSearch(BaseModel):
    titulo: str
    id_MAL: int
    linkMAL: HttpUrl
    tipo: str = "Anime"
    image: Optional[HttpUrl] = None


# Asignar id_MAL a un anime
class PayloadAnimeIDMAL(BaseModel):
    id: str = Field(..., pattern=r"^([a-fA-F0-9]{24})$")
    id_MAL: int = Field(..., ge=1)


# Respuesta de la actualizacion de animes incompletos con informacion de MAL
class ResponseUpdAllMALSchema(BaseModel):
    message: str
    totalToAct: int = 0
    totalAct: int = 0
