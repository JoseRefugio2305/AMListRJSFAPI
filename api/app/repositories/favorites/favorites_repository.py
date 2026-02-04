from bson import ObjectId

from app.schemas.anime import AniFavPayloadSchema
from app.schemas.auth import UserLogRespSchema
from app.models.utafavs_model import UTAFavsModel
from app.models.utmanfavs_model import UTManFavsModel


class FavoritesRepository:
    @staticmethod
    async def change_status_fav_anime(
        data: AniFavPayloadSchema, user: UserLogRespSchema, nowTS: str
    ):
        updated = await UTAFavsModel.update_one(
            {"user": ObjectId(user.id), "anime": ObjectId(data.animeId)},
            {
                "$set": {
                    "anime": ObjectId(data.animeId),
                    "user": ObjectId(user.id),
                    "active": data.active,
                    "statusView": data.statusView,
                },
                "$setOnInsert": {
                    "fechaAdicion": nowTS,
                },
            },
            upsert=True,
        )  # Actualizamos el registro o insertamos en caso de que no exista la relacion

        return updated
