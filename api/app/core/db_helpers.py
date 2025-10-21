from typing import Optional, List, Dict, Any
from bson.objectid import ObjectId

from app.schemas.filters_schema import EmisionFilterEnum, StatusViewEnum, TipoAnimeEnum


# Funcion para construir la consulta de favoritos en caso de que la peticion fuese hecha por un usuario autenticado
def lookup_user_favorites(
    userId: Optional[str] = None,
    field: str = "anime",
    collection: str = "utafavs",
    only_Favs: bool = False,
    statusView: StatusViewEnum = StatusViewEnum.ninguno,
) -> List[Dict[str, Any]]:
    if not userId:
        return []

    try:
        userId = ObjectId(userId)
    except:
        return []
    oFavsF = [{"$match": {"is_fav": True}}] if only_Favs else []
    sViewF = (
        [{"$match": {"statusView": statusView}}]
        if statusView != StatusViewEnum.ninguno and only_Favs
        else []
    )
    pipeline = [
        {
            "$lookup": {
                "from": collection,
                "let": {"itemId": "$_id", "userId": userId},
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$and": [
                                    {"$eq": [f"${field}", "$$itemId"]},
                                    {"$eq": ["$user", "$$userId"]},
                                ]
                            }
                        }
                    },
                    {"$match": {"active": True}},
                    *sViewF,
                ],
                "as": "is_fav",
            }
        },
        {"$addFields": {"is_fav": {"$gt": [{"$size": "$is_fav"}, 0]}}},
        *oFavsF,
    ]
    return pipeline


# Funcion para preparar filtro de busqueda por estado de emision/publicacion, o mostrar todos
def filtro_emision(estado_em_pub: int, field: str = "emision") -> List[Dict[str, Any]]:
    if estado_em_pub != EmisionFilterEnum.todos:
        return [
            {
                "$match": {f"{field}": estado_em_pub},
            }
        ]
    else:
        return []


# Funcion para ppreparar filtro de busqueda para el tipo de anime/manga
def filtrado_tipo(tipo_am: int, is_anime: bool = True) -> List[Dict[str, Any]]:
    if (
        is_anime and tipo_am != TipoAnimeEnum.desconocido
    ):  # Esta funcion sera actualizada en cuanto se comience la construcciones del modulo de manga
        return [
            {
                "$match": {"tipo": tipo_am},
            }
        ]
    else:
        return []
