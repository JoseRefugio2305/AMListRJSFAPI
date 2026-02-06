from typing import Optional

from app.models.user_model import UserModel
from app.schemas.auth import UserRegSchema
from app.schemas.search import ActiveUserEnum
from app.core.logging import get_logger

logger = get_logger(__name__)


class AuthRepository:
    @staticmethod
    async def find_by_email(
        email: str,
        username: Optional[str] = None,
        tipoactive: ActiveUserEnum = ActiveUserEnum.todos,
    ):
        return await UserModel.find_one({"$or": [{"email": email}, {"name": username}]})

    @staticmethod
    async def insert_user(data_n_user: UserRegSchema, email: str):
        inserted_id = await UserModel.insert_one(
            UserModel(**data_n_user.model_dump())
        )  # Insertamos
        logger.info(f"Usuario registrado: {inserted_id}")

        created_user = await UserModel.find_one(UserModel.email == email)

        return created_user
