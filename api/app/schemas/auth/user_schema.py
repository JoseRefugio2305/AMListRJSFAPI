from pydantic import (
    BaseModel,
    BeforeValidator,
    Field,
    EmailStr,
    field_validator,
    StringConstraints,
)
from typing import Annotated, List
import re

from .auth_schema import PASSWORD_REGEX, USERNAME_REGEX, UserLogRespSchema
from app.core.utils import str_trim_lower


# Schema del payload para hacer el cambio de imagen de perfil
class PayloadProfPicSchema(BaseModel):
    profile_pic: int


# Schema para el payload de cambio de username
class PayloadUsernameSchema(BaseModel):
    new_name: Annotated[
        str,
        BeforeValidator(str_trim_lower),
        StringConstraints(min_length=8, max_length=16, pattern=USERNAME_REGEX),
    ]
    old_name: Annotated[
        str,
        BeforeValidator(str_trim_lower),
        StringConstraints(min_length=8, max_length=16, pattern=USERNAME_REGEX),
    ]


# Schema para payload de cambio de email
class PayloadEmailSchema(BaseModel):
    new_email: Annotated[EmailStr, BeforeValidator(str_trim_lower)]
    old_email: Annotated[EmailStr, BeforeValidator(str_trim_lower)]


class PayloadPassSchema(BaseModel):
    new_pass: str = Field(..., min_length=8)
    old_pass: str = Field(..., min_length=8)

    @field_validator("new_pass", "old_pass")
    def pass_validator(cls, v):
        if not re.match(PASSWORD_REGEX, v):
            raise ValueError(
                "Formato de contraseña invalido. La contraseña debe tener letras mayúsculas y minúsculas, números, al menos un carácter especial (!@#_-%) y sin espacios en blanco, con una longitud de 8 a 16 caracteres."
            )
        return v

#Schema de respuesta al cambio de contraseña de un usuario
class ResponseNewPassSchema(BaseModel):
    message: str = "La contraseña fue actualizada con exito"

#Schema para payload de cambiar estado activo del usuario
class PayloadActiveStateSchema(BaseModel):
    userId:str
    is_active: bool

# Lista de usuarios filtrada para eldashboard
class UserListSchema(BaseModel):
    userList: List[UserLogRespSchema] = []
    total: int = 0
    page: int = 1
    totalPages: int = 1
