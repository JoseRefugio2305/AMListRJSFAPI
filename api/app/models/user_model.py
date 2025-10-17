from app.base.base_odm import BaseODMModel
from typing import Optional


class UserModel(BaseODMModel):
    collection_name = "users"

    # Busqueda por email
    @classmethod
    async def find_by_email(cls, email: str, username: Optional[str] = None):
        query = {"email": email}
        if username:
            query = {"$or": [{"email": email}, {"name": username}]}
        return await cls.find_one(query)
