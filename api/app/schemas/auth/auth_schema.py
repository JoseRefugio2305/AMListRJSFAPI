from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    BeforeValidator,
    field_validator,
    ConfigDict,
    StringConstraints,
)
from typing import Optional, Annotated
from app.core.utils import str_trim_lower
import re

PASSWORD_REGEX = r"^(?=.{8,16}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#_\-%])[A-Za-z\d!@#_\-%]{8,16}$"
USERNAME_REGEX = r"^[a-z0-9_-]{8,16}$"


# Schema del payload para el registro y log de usuario
class UserRegLogSchema(BaseModel):
    name: Annotated[
        str,
        BeforeValidator(str_trim_lower),
        StringConstraints(min_length=8, max_length=16, pattern=USERNAME_REGEX),
    ] = Field(
        ..., min_length=8, max_length=16
    )  # En Field el recibir como parametro ..., hace que este campo sea requerido
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
    name: Annotated[
        str,
        BeforeValidator(str_trim_lower),
        StringConstraints(min_length=8, max_length=16, pattern=USERNAME_REGEX),
    ] = Field(
        ..., min_length=8, max_length=16
    )  # En Field el recibir como parametro ..., hace que este campo sea requerido
    email: Annotated[EmailStr, BeforeValidator(str_trim_lower)]
    password: str = Field(..., min_length=8)
    rol: int = 0
    profile_pic: Optional[int] = None
    created_date: Optional[str] = None
    show_statistics: Optional[int] = 0


# Schema para la respuesta despues del registro o logeo
class UserLogRespSchema(BaseModel):
    id: str
    name: str
    email: EmailStr
    rol: int = 0
    profile_pic: Optional[int] = None
    access_token: str
    created_date: Optional[str] = None
    show_statistics: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)
