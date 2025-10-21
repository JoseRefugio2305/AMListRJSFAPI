from app.base.base_odm import BaseODMModel
from bson.objectid import ObjectId


class UTAFavsModel(BaseODMModel):
    collection_name = "utafavs"

    # Busqueda de un documento en el que el usuario haya marcado un anime como favorito en algun momento, sin importar que este se haya desmarcado
    @classmethod
    async def find_by_uid_aid(cls, userid: ObjectId, animeid: ObjectId):
        return await cls.find_one({"anime": animeid, "user": userid})
