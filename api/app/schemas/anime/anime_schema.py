from pydantic import BaseModel, Field, HttpUrl, ConfigDict, AfterValidator
from typing import Optional, List, Annotated
from .anime_enums import EstadoEmEnum, TipoAnimeEnum, StatusViewEnum
from app.schemas.common.relations import (
    AnimeRelationsSchema,
    StudiosARelSchema,
    AltTitlesSchema,
    AnimeAdapFullSchema,
    AnimeRelTypeFullSchema,
    AnimeRelTypeIncompleteSchema,
)
from app.schemas.common.images import AnimeImagesSchema
from app.schemas.common.genres import GenreARelSchema
from app.core.utils import httpurl_to_str, ObjectIdStr


PATTERN_ID = r"^([a-fA-F0-9]{24})$"


# Schema para la creacion del anime por el administrador
class AnimeCreateSchema(BaseModel):
    key_anime: int = Field(..., ge=1)
    titulo: str = Field(...)
    link_p: Annotated[HttpUrl, AfterValidator(httpurl_to_str)] = Field(
        ...
    )  # La conversion posterior es necesaria para que al serializar antes de insertar no de errores al intentar serializar HttpUrl como string
    tipo: TipoAnimeEnum = Field(TipoAnimeEnum.anime)


# Schema para la consulta de animes que tienen su informacion incompleta
class AnimeIncompleteSchema(AnimeCreateSchema):
    id: ObjectIdStr
    id_MAL: Optional[int] = None


# Respuesta anime creado, actualizado
class ResponseUpdCrtAnime(BaseModel):
    message: str


# Respuesta anime actualizado desde MAL
class RespUpdMALAnimeSchema(ResponseUpdCrtAnime):
    is_success: bool


# Anime
class AnimeSchema(AnimeCreateSchema):
    id: ObjectIdStr
    animeImages: AnimeImagesSchema
    calificacion: float = Field(ge=0, le=10)
    descripcion: str
    emision: EstadoEmEnum
    episodios: float = Field(..., ge=0)
    fechaAdicion: str
    fechaEmision: str
    generos: Optional[List[GenreARelSchema]]
    id_MAL: int
    linkMAL: HttpUrl
    link_p: str  # En Este esquema se usa el link_p como string para evitar errores de conversion a HttpUrl
    numRatings: int = Field(..., ge=0)
    relaciones: Optional[List[AnimeRelTypeFullSchema]] = None
    adaptaciones: Optional[List[AnimeAdapFullSchema]] = None
    studios: Optional[List[StudiosARelSchema]] = None
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
    animeImages: Optional[AnimeImagesSchema] = None
    calificacion: Optional[float] = Field(default=0, ge=0, le=10)
    descripcion: Optional[str] = None
    emision: Optional[EstadoEmEnum] = None
    episodios: Optional[float] = Field(default=None, ge=0)
    fechaEmision: Optional[str] = None
    generos: Optional[List[GenreARelSchema]] = None
    linkMAL: Optional[Annotated[HttpUrl, AfterValidator(httpurl_to_str)]] = None
    numRatings: Optional[int] = Field(default=0, ge=0)
    relaciones: Optional[List[AnimeRelTypeIncompleteSchema]] = None
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
    id: ObjectIdStr
    id_MAL: int = Field(..., ge=1)


# Respuesta de la actualizacion de animes incompletos con informacion de MAL
class ResponseUpdAllMALSchema(BaseModel):
    message: str
    totalToAct: int = 0
    totalAct: int = 0
