from bson import ObjectId

from app.schemas.anime import AnimeCreateSchema
from app.schemas.common.relations import CreateStudioSchema
from app.models.anime_model import AnimeModel
from app.models.studio_model import StudioModel
from app.models.utafavs_model import UTAFavsModel
from app.core.cache.cache_manager import cache_manager
from app.core.logging import get_logger
from app.core.utils import ObjectIdStr

logger = get_logger(__name__)


class AnimeCRUDRepository:
    @staticmethod
    async def create(anime_to_create: AnimeCreateSchema):
        insertedId = await AnimeModel.insert_one(AnimeModel(**anime_to_create))
        await cache_manager.invalidate_search()  # Invalidamos el cache de busqueda para que se actualice la lista de animes al crear uno nuevo
        return insertedId

    @staticmethod
    async def update(anime_id: ObjectIdStr, data: dict):
        anime_updated = await AnimeModel.find_one(AnimeModel.id == ObjectId(anime_id))
        await anime_updated.update({"$set": data})
        await cache_manager.invalidate_anime(
            anime_updated.key_anime
        )  # Invalidamos el cache del anime actualizado para que se actualice la informacion al hacer una consulta
        await cache_manager.invalidate_search()  # Invalidamos el cache de busqueda para que se actualice la lista de animes al actualizar uno nuevo
        return anime_updated

    @staticmethod
    async def update_id_mal(anime_id: ObjectIdStr, id_MAL: int):
        anime_updated = await AnimeModel.find_one(AnimeModel.id == ObjectId(anime_id))
        await anime_updated.update({"$set": {"id_MAL": id_MAL}})
        return anime_updated

    @staticmethod
    async def delete(anime_id: ObjectIdStr):
        anime = await AnimeModel.find_one(AnimeModel.id == ObjectId(anime_id))
        anime_deleted = await anime.delete()
        if anime_deleted.deleted_count == 0:  # Si no se encuntra el anime a eliminar
            return False
        await UTAFavsModel.find(UTAFavsModel.anime == ObjectId(anime_id)).delete()
        await cache_manager.invalidate_anime(
            anime.key_anime
        )  # Invalidamos el cache del anime actualizado para que se actualice la informacion al hacer una consulta
        await cache_manager.invalidate_search()  # Invalidamos el cache de busqueda para que se actualice la lista de animes al eliminar uno
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

        await cache_manager.invalidate_filters()
        await cache_manager.invalidate_search()  # Invalidamos el cache de busqueda para evitar discrepancias al haber un nuevo estudio que puede ser un filtro nuevo y no estar en el cache

        return new_studio
