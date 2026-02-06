from bson import ObjectId
from typing import Any

# Recibe un diccionario y convierte el _id de mongo de ObjectId a string
def object_id_to_str(doc: dict) -> dict:
    # Si se recibe un vacio se retorna

    if not doc:
        return doc
    # Creamos copia del doc
    copy = dict(doc)
    _id = copy.get("_id") or copy.get("id") or copy.get("Id")
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
