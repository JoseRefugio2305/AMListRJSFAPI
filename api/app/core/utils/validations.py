from bson import ObjectId
import re
from typing import Annotated
from pydantic import AfterValidator, HttpUrl, BeforeValidator


# Funcion usada para quitar esacios de extremos y convertir a minusculas para validacion
def str_trim_lower(value: str) -> str:
    return value.strip().lower()


# Verificamos el formato del username
def val_username(username: str) -> str:
    from app.schemas.auth import USERNAME_REGEX

    username = str_trim_lower(username)
    if not re.fullmatch(USERNAME_REGEX, username):
        raise ValueError(
            "Formato de username invalido, debe terner letras, digitos y guienes bajos y medios."
        )
    return username


UsernameType = Annotated[str, BeforeValidator(val_username)]


# Convertir HttpUrl a str
def httpurl_to_str(value: HttpUrl) -> str:
    return str(value)


# Validacion de id de ObjectId
def validate_objectid(v: str) -> str:
    if not ObjectId.is_valid(v):
        raise ValueError("Formato de ObjectId invalido")
    return v


ObjectIdStr = Annotated[str, AfterValidator(validate_objectid)]


# Validacion del archivo de animes
def validate_file_animes(filename: str, file_size: int) -> bool:
    # Revisamos la extension
    if not filename.endswith(".json"):
        return False
    # Revisamos el tamaño del archivo
    MAX_SIZE = 1024 * 1024  # 1 MB en bytes de tamano maximo

    # Comparamos el tamano
    if file_size > MAX_SIZE:
        return False

    return True
