from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    BeforeValidator,
    field_validator,
    ConfigDict,
)
from enum import IntEnum
from typing import Optional, Annotated
from app.core.utils import ObjectIdStr, str_trim_lower, UsernameType
import re

PASSWORD_REGEX = r"^(?=.{8,16}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#_\-%])[A-Za-z\d!@#_\-%]{8,16}$"
USERNAME_REGEX = r"^[a-z0-9_-]{8,16}$"


# Enum para los roles de usuario
class RolEnum(IntEnum):
    base_user = 0
    admin = 1


# Schema del payload para el registro y log de usuario
class UserRegLogSchema(BaseModel):
    name: Optional[UsernameType] = Field("")
    email: Annotated[EmailStr, BeforeValidator(str_trim_lower)]
    password: str = Field(..., min_length=8)

    @field_validator("password")
    def pass_validator(cls, v):
        if not re.match(PASSWORD_REGEX, v):
            raise ValueError(
                "Formato de contraseña invalido. La contraseña debe tener letras mayúsculas y minúsculas, números, al menos un carácter especial (!@#_-%) y sin espacios en blanco, con una longitud de 8 a 16 caracteres."
            )
        return v


# Schema para registro de ususario en BDD
class UserRegSchema(BaseModel):
    name: UsernameType
    email: Annotated[EmailStr, BeforeValidator(str_trim_lower)]
    password: str = Field(..., min_length=8)
    rol: RolEnum = RolEnum.base_user
    is_active: bool = True
    profile_pic: Optional[int] = None
    created_date: Optional[str] = None
    show_statistics: Optional[int] = 0


# Schema para la respuesta despues del registro o logeo
class UserLogRespSchema(BaseModel):
    id: ObjectIdStr
    name: UsernameType
    email: EmailStr
    rol: RolEnum = RolEnum.base_user
    is_active: bool = True
    profile_pic: Optional[int] = None
    access_token: str
    created_date: Optional[str] = None
    show_statistics: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)
