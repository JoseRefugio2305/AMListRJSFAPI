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
        insertedId = await MangaModel.insert_one(MangaModel(**manga_to_create))
        return insertedId

    @staticmethod
    async def update_manga(manga_id: ObjectIdStr, data: dict):
        manga_updated = await MangaModel.find_one(MangaModel.id == ObjectId(manga_id))
        await manga_updated.update({"$set": data})
        return manga_updated

    @staticmethod
    async def update_id_mal_manga(manga_id: ObjectIdStr, id_MAL: int):
        manga_updated = await MangaModel.find_one(MangaModel.id == ObjectId(manga_id))
        await manga_updated.update({"$set": {"id_MAL": id_MAL}})
        return manga_updated

    @staticmethod
    async def delete_manga(manga_id: ObjectIdStr):
        # Eliminamos el manga si existe
        manga_deleted = await MangaModel.find_one(
            MangaModel.id == ObjectId(manga_id)
        ).delete()
        if manga_deleted.deleted_count == 0:  # Si no se encuntra el manga a eliminar
            return False
        await UTManFavsModel.find(UTManFavsModel.manga == ObjectId(manga_id)).delete()

        return True

    @staticmethod
    async def create_editorial(editorial: CreateEditorialSchema):
        new_editorial = await EditorialModel.find_one(
            EditorialModel.id_MAL == editorial.id_MAL
        ).upsert(
            {
                "$set": {
                    "nombre": editorial.nombre,
                    "linkMAL": editorial.linkMAL,
                }
            },
            on_insert=EditorialModel(**editorial.model_dump()),
        )

        return new_editorial

    @staticmethod
    async def create_author(author: CreateAutorSchema):
        new_author = await AuthorModel.find_one(
            AuthorModel.id_MAL == author.id_MAL
        ).upsert(
            {
                "$set": {
                    "nombre": author.nombre,
                    "linkMAL": author.linkMAL,
                }
            },
            on_insert=AuthorModel(**author.model_dump()),
        )
        return new_author
