from pydantic import BaseModel
from app.schemas.anime import StatusViewEnum
from app.core.utils import ObjectIdStr


# Mangas favoritos
class MangaFavsSchema(BaseModel):
    id: ObjectIdStr
    user: str
    manga: str
    active: bool
    statusView: StatusViewEnum
    fechaAdicion: str


# Payload para agregar manga a favoritos
class MangaFavPayloadSchema(BaseModel):
    mangaId: ObjectIdStr
    active: bool
    statusView: StatusViewEnum
