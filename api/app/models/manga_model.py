from app.base.base_odm import BaseODMModel
from bson.objectid import ObjectId


class MangaModel(BaseODMModel):
    collection_name = "mangas"

    @classmethod
    async def find_by_id(cls, mangaId: ObjectId):
        return await cls.find_one({"_id": mangaId})

    # Busqueda por key_manga
    @classmethod
    async def find_by_key(cls, key_manga: int):
        return await cls.find_one({"key_manga": key_manga})

    @classmethod
    async def find_by_idmal(cls, id_MAL: int):
        return await cls.find_one({"id_MAL": id_MAL})
