from bson import ObjectId

from app.schemas.anime import AnimeCreateSchema
from app.schemas.common.relations import CreateStudioSchema
from app.models.anime_model import AnimeModel
from app.models.studio_model import StudioModel
from app.models.utafavs_model import UTAFavsModel
from app.core.logging import get_logger
from app.core.utils import ObjectIdStr, time_now_formatted

logger = get_logger(__name__)


class AnimeCRUDRepository:
    @staticmethod
    async def create_anime(anime_to_create: AnimeCreateSchema):
        insertedId = await AnimeModel.insert_one(anime_to_create)
        return insertedId

    @staticmethod
    async def update_anime(anime_id: ObjectIdStr, data: dict):
        anime_updated = await AnimeModel.find_and_update(
            {"_id": ObjectId(anime_id)}, data, upsert=False
        )
        return anime_updated

    @staticmethod
    async def update_id_mal_anime(anime_id: ObjectIdStr, id_MAL: int):
        anime_updated = await AnimeModel.find_and_update(
            {"_id": ObjectId(anime_id)}, {"id_MAL": id_MAL}, upsert=False
        )
        return anime_updated

    @staticmethod
    async def delete_anime(anime_id: ObjectIdStr):
        aniem_deleted = await AnimeModel.delete_one({"_id": ObjectId(anime_id)})
        if aniem_deleted.deleted_count == 0:  # Si no se encuntra el anime a eliminar
            return False
        await UTAFavsModel.delete_many({"anime": ObjectId(anime_id)})

        return True

    @staticmethod
    async def create_studio(studio: CreateStudioSchema):
        new_studio = await StudioModel.update_one(
            {"id_MAL": studio.id_MAL},
            {
                "$set": {
                    "nombre": studio.nombre,
                    "linkMAL": studio.linkMAL,
                },
                "$setOnInsert": {
                    "fechaAdicion": time_now_formatted(True),
                    "id_MAL": studio.id_MAL,
                },
            },
            True,
        )

        return new_studio
