from bson import ObjectId

from app.schemas.anime import AnimeCreateSchema
from app.schemas.common.relations import CreateStudioSchema
from app.models.anime_model import AnimeModel
from app.models.studio_model import StudioModel
from app.models.utafavs_model import UTAFavsModel
from app.core.logging import get_logger
from app.core.utils import ObjectIdStr

logger = get_logger(__name__)


class AnimeCRUDRepository:
    @staticmethod
    async def create_anime(anime_to_create: AnimeCreateSchema):
        insertedId = await AnimeModel.insert_one(AnimeModel(**anime_to_create))
        return insertedId

    @staticmethod
    async def update_anime(anime_id: ObjectIdStr, data: dict):
        anime_updated = await AnimeModel.find_one(AnimeModel.id == ObjectId(anime_id))
        await anime_updated.update({"$set": data})
        return anime_updated

    @staticmethod
    async def update_id_mal_anime(anime_id: ObjectIdStr, id_MAL: int):
        anime_updated = await AnimeModel.find_one(AnimeModel.id == ObjectId(anime_id))
        await anime_updated.update({"$set": {"id_MAL": id_MAL}})
        return anime_updated

    @staticmethod
    async def delete_anime(anime_id: ObjectIdStr):
        anime_deleted = await AnimeModel.find_one(
            AnimeModel.id == ObjectId(anime_id)
        ).delete()
        if anime_deleted.deleted_count == 0:  # Si no se encuntra el anime a eliminar
            return False
        await UTAFavsModel.find(UTAFavsModel.anime == ObjectId(anime_id)).delete()

        return True

    @staticmethod
    async def create_studio(studio: CreateStudioSchema):
        new_studio = await StudioModel.find_one(
            StudioModel.id_MAL == studio.id_MAL
        ).upsert(
            {
                "$set": {
                    "nombre": studio.nombre,
                    "linkMAL": studio.linkMAL,
                }
            },
            on_insert=StudioModel(**studio.model_dump()),
        )

        return new_studio
