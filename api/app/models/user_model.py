from beanie import Document
from pydantic import (
    BeforeValidator,
    EmailStr,
    Field,
    BeforeValidator,
)
from typing import Annotated, Optional
from pymongo import IndexModel, ASCENDING

from app.schemas.auth import RolEnum
from app.core.utils import (
    time_now_formatted,
    str_trim_lower,
    UsernameType,
    object_id_to_str,
)


class UserModel(Document):
    name: UsernameType
    email: Annotated[EmailStr, BeforeValidator(str_trim_lower)]
    password: Optional[str] = Field(default="", min_length=8)
    rol: RolEnum = RolEnum.base_user
    is_active: bool = True
    profile_pic: Optional[int] = 1
    created_date: str = time_now_formatted(True)
    show_statistics: int = 0

    class Settings:
        name = "users"
        indexes = [
            IndexModel(
                [("name", ASCENDING)],
                unique=True,
                name="name_user_idx",
            ),
            IndexModel(
                [("email", ASCENDING)],
                unique=True,
                name="email_user_idx",
            ),
        ]

    @classmethod
    def to_user(cls, userInfo: dict, token: str):
        from app.schemas.auth import UserLogRespSchema, RolEnum

        userInfo = object_id_to_str(userInfo)

        return UserLogRespSchema(
            id=userInfo.get("_id") or userInfo.get("id") or userInfo.get("Id"),
            name=userInfo.get("name"),
            email=userInfo.get("email"),
            rol=userInfo.get("rol", RolEnum.base_user),
            is_active=userInfo.get("is_active", True),
            profile_pic=userInfo.get("profile_pic"),
            created_date=userInfo.get("created_date"),
            show_statistics=userInfo.get("show_statistics"),
            access_token=token,
        )
