from pydantic import BaseModel, Field
from .anime_enums import StatusViewEnum
# Animes favoritos
class AniFavsSchema(BaseModel):
    id: str = Field(..., pattern=r"^([a-fA-F0-9]{24})$")
    user: str
    anime: str
    active: bool
    statusView: StatusViewEnum
    fechaAdicion: str


# Payload para agregar anime a favoritos
class AniFavPayloadSchema(BaseModel):
    animeId: str = Field(..., pattern=r"^([a-fA-F0-9]{24})$")
    active: bool
    statusView: StatusViewEnum


# Respuesta al agregar el anime a favoritos o removerlo, tambien sera utilizado por manga
class AniFavRespSchema(BaseModel):
    active: bool
    statusView: StatusViewEnum