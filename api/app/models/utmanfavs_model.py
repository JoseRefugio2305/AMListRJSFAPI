from app.base.base_odm import BaseODMModel
from bson.objectid import ObjectId


class UTManFavsModel(BaseODMModel):
    collection_name = "utmanfavs"

    # Busqueda de un documento en el que el usuario haya marcado un manga como favorito en algun momento, sin importar que este se haya desmarcado
    @classmethod
    async def find_by_uid_mid(cls, userid: ObjectId, mangaId: ObjectId):
        return await cls.find_one({"manga": mangaId, "user": userid})
