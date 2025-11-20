from pydantic import BaseModel, Field
from typing import Optional, List
from .images import AnimeImagesSchema, MangaImagesSchema
from pydantic import BaseModel, Field, HttpUrl, AfterValidator, AliasChoices
from typing import Optional, Annotated, List
from app.core.utils import httpurl_to_str, ObjectIdStr


# Relaciones del anime
class AnimeRelationsSchema(BaseModel):
    id_MAL: int
    titulo: str
    type_rel: Optional[str] = None


# Esquema para relaciones completas del anime
class AnimeRelFullSchema(AnimeRelationsSchema):
    key_anime: int = Field(..., ge=1)
    animeImages: List[AnimeImagesSchema]


# Esquema para las adaptaciones
class AnimeAdapFullSchema(AnimeRelationsSchema):
    key_manga: int = Field(..., ge=1)
    mangaImages: List[MangaImagesSchema]


# Relacion de adaptaciones del manga
class AdaptacionSchema(BaseModel):
    titulo: str = Field(validation_alias=AliasChoices("titulo", "nombre"))
    id_MAL: int


# Schema para la relacion de adaptacion completa para consulta especifica del manga
class AdaptacionFullSchema(AdaptacionSchema):
    key_anime: int = Field(..., ge=1)
    animeImages: List[AnimeImagesSchema]


# Relaciones del manga
class MangaRelationsSchema(BaseModel):
    titulo: str = Field(validation_alias=AliasChoices("titulo", "nombre"))
    id_MAL: int
    type_rel: Optional[str] = None


# Schema para relacion completa cuando se consulte un anime especifico
class MangaRelFullSchema(MangaRelationsSchema):
    key_manga: int = Field(..., ge=1)
    mangaImages: List[MangaImagesSchema]


# Relacion de estudios en animes
class StudiosARelSchema(BaseModel):
    nombre: str
    id_MAL: int


class CreateStudioSchema(StudiosARelSchema):
    linkMAL: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]
    fechaAdicion: str


# Estudios de Animacion
class StudiosSchema(CreateStudioSchema):
    id: ObjectIdStr


# Tipos de animes (animes, OVA, ONA, etc.)
class AnimeTypesSchema(BaseModel):
    id: ObjectIdStr
    code: int = Field(..., ge=1, le=6)
    nombre: str
    fechaAdicion: str


# Titulos Alternaivos usado en manga tambien
class AltTitlesSchema(BaseModel):
    tit_alt: str
    tipo: str


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


# Tipos de mangas (manga, NL, one-shot, etc.)
class MangaTypesSchema(BaseModel):
    id: ObjectIdStr
    code: int = Field(..., ge=1, le=6)
    nombre: str
    fechaAdicion: str
