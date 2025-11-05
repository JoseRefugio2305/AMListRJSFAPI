from app.base.base_odm import BaseODMModel


class GeneroModel(BaseODMModel):
    collection_name = "generos"
    
    @classmethod
    async def find_by_idmal(cls, id_MAL: int):
        return await cls.find_one({"id_MAL": id_MAL})
    
