from app.base.base_odm import BaseODMModel


class AnimeModel(BaseODMModel):
    collection_name = "animes"

    # Busqueda por key_anime
    @classmethod
    async def find_by_key(cls, key_anime: int):
        return await cls.find_one({"key_anime": key_anime})
    
    @classmethod
    async def find_by_idmal(cls, id_MAL: int):
        return await cls.find_one({"id_MAL": id_MAL})
    
