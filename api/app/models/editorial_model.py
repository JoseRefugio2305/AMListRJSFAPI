from app.base.base_odm import BaseODMModel


class EditorialModel(BaseODMModel):
    collection_name = "editorials"

    @classmethod
    async def find_by_idmal(cls, id_MAL: int):
        return await cls.find_one({"id_MAL": id_MAL})
