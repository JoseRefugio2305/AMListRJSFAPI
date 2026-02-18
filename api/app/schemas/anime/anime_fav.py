from pydantic import BaseModel
from .anime_enums import StatusViewEnum
from app.core.utils import ObjectIdStr
# Animes favoritos
class AniFavsSchema(BaseModel):
    id: ObjectIdStr
    user: str
    anime: str
    active: bool
    statusView: StatusViewEnum
    fechaAdicion: str


# Payload para agregar anime a favoritos
class AniFavPayloadSchema(BaseModel):
    animeId: ObjectIdStr
    active: bool
    statusView: StatusViewEnum


# Respuesta al agregar el anime a favoritos o removerlo, tambien sera utilizado por manga
class AniFavRespSchema(BaseModel):
    active: bool
    statusView: StatusViewEnum