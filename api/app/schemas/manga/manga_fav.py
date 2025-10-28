from pydantic import BaseModel, Field
from app.schemas.anime import (
    StatusViewEnum,
    PATTERN_ID,
)

# Mangas favoritos
class MangaFavsSchema(BaseModel):
    id: str = Field(..., pattern=PATTERN_ID)
    user: str
    manga: str
    active: bool
    statusView: StatusViewEnum
    fechaAdicion: str


# Payload para agregar manga a favoritos
class MangaFavPayloadSchema(BaseModel):
    mangaId: str = Field(..., pattern=PATTERN_ID)
    active: bool
    statusView: StatusViewEnum