from bson import ObjectId

from app.schemas.manga import MangaCreateSchema
from app.schemas.common.relations import CreateEditorialSchema, CreateAutorSchema
from app.models.manga_model import MangaModel
from app.models.editorial_model import EditorialModel
from app.models.author_model import AuthorModel
from app.models.utmanfavs_model import UTManFavsModel
from app.core.logging import get_logger
from app.core.utils import ObjectIdStr, time_now_formatted

logger = get_logger(__name__)


class MangaCRUDRepository:
    @staticmethod
    async def create_manga(manga_to_create: MangaCreateSchema):
        return await MangaModel.insert_one(manga_to_create)

    @staticmethod
    async def update_manga(manga_id: ObjectIdStr, data: dict):
        updated_manga = await MangaModel.find_and_update(
            {"_id": ObjectId(manga_id)}, data, upsert=False
        )
        return updated_manga

    @staticmethod
    async def update_id_mal_manga(manga_id: ObjectIdStr, id_MAL: int):
        anime_updated = await MangaModel.update_one(
            {"_id": ObjectId(manga_id)},
            {"$set": {"id_MAL": id_MAL}},
            False,
        )
        return anime_updated

    @staticmethod
    async def delete_manga(manga_id: ObjectIdStr):
        # Eliminamos el manga si existe
        deleted_manga = await MangaModel.delete_one({"_id": ObjectId(manga_id)})
        if deleted_manga.deleted_count == 0:  # Si no se encuntra el manga a eliminar
            return False
        await UTManFavsModel.delete_many({"manga": ObjectId(manga_id)})

        return True

    @staticmethod
    async def create_editorial(editorial: CreateEditorialSchema):
        new_editorial = await EditorialModel.update_one(
            {"id_MAL": editorial.id_MAL},
            {
                "$set": {
                    "nombre": editorial.nombre,
                    "linkMAL": editorial.linkMAL,
                },
                "$setOnInsert": {
                    "tipo": editorial.tipo,
                    "fechaAdicion": time_now_formatted(True),
                    "id_MAL": editorial.id_MAL,
                },
            },
            True,
        )

        return new_editorial

    @staticmethod
    async def create_author(author: CreateAutorSchema):
        new_author = await AuthorModel.update_one(
            {"id_MAL": author.id_MAL},
            {
                "$set": {
                    "nombre": author.nombre,
                    "linkMAL": author.linkMAL,
                },
                "$setOnInsert": {
                    "tipo": author.tipo,
                    "fechaAdicion": time_now_formatted(True),
                    "id_MAL": author.id_MAL,
                },
            },
            True,
        )
        return new_author
