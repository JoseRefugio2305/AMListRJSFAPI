from bson import ObjectId
import re
from typing import Any, Annotated
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


# Recibe un diccionario y convierte el _id de mongo de ObjectId a string
def object_id_to_str(doc: dict) -> dict:
    # Si se recibe un vacio se retorna
    if not doc:
        return doc

    # Creamos copia del doc
    copy = dict(doc)
    _id = copy.get("_id")
    if isinstance(_id, ObjectId):
        copy["_id"] = str(_id)  # Hacemos conversion si el _id era un ObjectId
    return copy


# Recibe una lista de docs y de forma recursiva los convierte objectid en str
def objects_id_list_to_str(data: Any) -> Any:
    if isinstance(data, list):
        # Esta funcion retornara una lista de los mismos objetos con el _id en str
        # Primero recorremos la lista cuando se reciba como parametro una lista y cada objeto los evaluamos en esta funcion
        return [objects_id_list_to_str(d) for d in data]
    if isinstance(data, dict):
        # Cuando se reciba un objeto diccionario, se recorreran sus claves y valores y los valores se intentaran convertir a str con esta misma funcion
        return {k: objects_id_list_to_str(v) for k, v in data.items()}

    # Cuando ya no se reciba una lista o un diccionario, se estara recibiendo alguno de los valores de las propiedades del diccionario en turno
    # Si esta propiedad es un objectid lo convertimos a str
    if isinstance(data, ObjectId):
        return str(data)
    else:  # Si no lo es la retornamos sin cambio
        return data


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
