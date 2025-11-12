from app.base.base_odm import BaseODMModel
from app.schemas.search import ActiveUserEnum

from typing import Optional


class UserModel(BaseODMModel):
    collection_name = "users"

    # Busqueda por email
    @classmethod
    async def find_by_email(
        cls,
        email: str,
        username: Optional[str] = None,
        tipoactive: ActiveUserEnum = ActiveUserEnum.todos,
    ):
        # Revisamos que tipo de usuario activo, inactivo o todos
        query_active = (
            {"is_active": tipoactive == ActiveUserEnum.activo}
            if tipoactive != ActiveUserEnum.todos
            else {}
        )
        if username:
            or_clause = {"$or": [{"email": email}, {"name": username}]}
            if query_active:
                query = {"$and": [query_active, or_clause]}
            else:
                query = or_clause
        else:
            query = {"email": email}
            if query_active:
                query.update(query_active)

        return await cls.find_one(query)
