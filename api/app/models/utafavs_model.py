from beanie import Document, PydanticObjectId
from pymongo import IndexModel, ASCENDING

from app.schemas.anime import StatusViewEnum


class UTAFavsModel(Document):
    user: PydanticObjectId
    anime: PydanticObjectId
    active: bool
    statusView: StatusViewEnum
    fechaAdicion: str

    class Settings:
        name = "utafavs"
        indexes = [
            IndexModel(
                [("anime", ASCENDING)],
                name="anime_user_rel_idx",
            ),
            IndexModel(
                [("user", ASCENDING)],
                name="user_anime_rel_idx",
            ),
        ]
