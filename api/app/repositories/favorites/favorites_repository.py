from bson import ObjectId

from app.schemas.anime import AniFavPayloadSchema
from app.schemas.manga import MangaFavPayloadSchema
from app.schemas.auth import UserLogRespSchema
from app.models.utafavs_model import UTAFavsModel
from app.models.utmanfavs_model import UTManFavsModel


class FavoritesRepository:
    @staticmethod
    async def change_status_fav_anime(
        data: AniFavPayloadSchema, user: UserLogRespSchema, nowTS: str
    ):
        updated = await UTAFavsModel.find_one(
            UTAFavsModel.user == ObjectId(user.id),
            UTAFavsModel.anime == ObjectId(data.animeId),
        ).upsert(
            {
                "$set": {
                    "anime": ObjectId(data.animeId),
                    "user": ObjectId(user.id),
                    "active": data.active,
                    "statusView": data.statusView,
                },
            },
            on_insert=UTAFavsModel(
                anime=ObjectId(data.animeId),
                user=ObjectId(user.id),
                active=data.active,
                statusView=data.statusView,
                fechaAdicion=nowTS,
            ),
        )  # Actualizamos el registro o insertamos en caso de que no exista la relacion

        return updated

    @staticmethod
    async def change_status_fav_manga(
        data: MangaFavPayloadSchema, user: UserLogRespSchema, nowTS: str
    ):
        updated = await UTManFavsModel.find_one(
            UTManFavsModel.user == ObjectId(user.id),
            UTManFavsModel.manga == ObjectId(data.mangaId),
        ).upsert(
            {
                "$set": {
                    "manga": ObjectId(data.mangaId),
                    "user": ObjectId(user.id),
                    "active": data.active,
                    "statusView": data.statusView,
                }
            },
            on_insert=UTManFavsModel(
                manga=ObjectId(data.mangaId),
                user=ObjectId(user.id),
                active=data.active,
                statusView=data.statusView,
                fechaAdicion=nowTS,
            ),
        )  # Actualizamos el registro o insertamos en caso de que no exista la relacion
        return updated
