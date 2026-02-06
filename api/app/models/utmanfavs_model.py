from beanie import Document, PydanticObjectId
from pymongo import IndexModel, ASCENDING

from app.schemas.anime import StatusViewEnum


class UTManFavsModel(Document):
    user: PydanticObjectId
    manga: PydanticObjectId
    active: bool
    statusView: StatusViewEnum
    fechaAdicion: str

    class Settings:
        name = "utmanfavs"
        indexes = [
            IndexModel(
                [("manga", ASCENDING), ("user", ASCENDING)],
                name="manga_user_rel_idx",
                unique=True,
            )
        ]
