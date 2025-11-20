from pydantic import BaseModel, HttpUrl, AfterValidator
from typing import Annotated
from app.core.utils import httpurl_to_str, ObjectIdStr


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
    id: ObjectIdStr
    fechaAdicion: str
