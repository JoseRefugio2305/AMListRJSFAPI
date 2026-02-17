from bson import ObjectId

from app.schemas.manga import MangaCreateSchema
from app.schemas.common.relations import CreateEditorialSchema, CreateAutorSchema
from app.models.manga_model import MangaModel
from app.models.editorial_model import EditorialModel
from app.models.author_model import AuthorModel
from app.models.utmanfavs_model import UTManFavsModel
from app.core.cache.cache_manager import cache_manager
from app.core.logging import get_logger
from app.core.utils import ObjectIdStr

logger = get_logger(__name__)


class MangaCRUDRepository:
    @staticmethod
    async def create(manga_to_create: MangaCreateSchema):
        insertedId = await MangaModel.insert_one(MangaModel(**manga_to_create))
        await cache_manager.invalidate_search()  # Invalidamos el cache de busqueda para que se actualice la lista de animes al crear uno nuevo
        return insertedId

    @staticmethod
    async def update(manga_id: ObjectIdStr, data: dict):
        manga_updated = await MangaModel.find_one(MangaModel.id == ObjectId(manga_id))
        await manga_updated.update({"$set": data})
        await cache_manager.invalidate_manga(
            manga_updated.key_manga
        )  # Invalidamos el cache del manga actualizado para que se actualice la informacion al hacer una consulta
        await cache_manager.invalidate_search()  # Invalidamos el cache de busqueda para que se actualice la lista de mangas al acyualizar uno nuevo
        return manga_updated

    @staticmethod
    async def update_id_mal(manga_id: ObjectIdStr, id_MAL: int):
        manga_updated = await MangaModel.find_one(MangaModel.id == ObjectId(manga_id))
        await manga_updated.update({"$set": {"id_MAL": id_MAL}})
        return manga_updated

    @staticmethod
    async def delete(manga_id: ObjectIdStr):
        # Eliminamos el manga si existe
        manga = await MangaModel.find_one(MangaModel.id == ObjectId(manga_id))
        manga_deleted = await manga.delete()
        if manga_deleted.deleted_count == 0:  # Si no se encuntra el manga a eliminar
            return False
        await UTManFavsModel.find(UTManFavsModel.manga == ObjectId(manga_id)).delete()
        await cache_manager.invalidate_manga(
            manga.key_manga
        )  # Invalidamos el cache del manga actualizado para que se actualice la informacion al hacer una consulta
        await cache_manager.invalidate_search()  # Invalidamos el cache de busqueda para que se actualice la lista de mangas al eliminar uno
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

        await cache_manager.invalidate_filters()
        await cache_manager.invalidate_search()  # Invalidamos el cache de busqueda para evitar discrepancias al haber una nueva editorial que puede ser un filtro nuevo y no estar en el cache

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

        await cache_manager.invalidate_filters()
        await cache_manager.invalidate_search()  # Invalidamos el cache de busqueda para evitar discrepancias al haber un nuevo autor que puede ser un filtro nuevo y no estar en el cache

        return new_author
