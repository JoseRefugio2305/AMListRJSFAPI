from typing import Optional, List, Dict, Any
from bson.objectid import ObjectId

from app.schemas.search import (
    EmisionFilterEnum,
    FilterSchema,
    OrderByEnum,
    FieldOrdEnum,
)
from app.schemas.anime import TipoAnimeEnum, StatusViewEnum
from app.schemas.manga import TipoMangaEnum


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
                "as": "favData",
            }
        },
        {"$addFields": {"is_fav": {"$gt": [{"$size": "$favData"}, 0]}}},
        {
            "$addFields": {
                "statusView": {
                    "$cond": {
                        "if": "$is_fav",
                        "then": {"$first": "$favData.statusView"},
                        "else": StatusViewEnum.ninguno,
                    }
                }
            }
        },
        {"$unset": "favData"},
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
def filtrado_tipos(tipos_am: List[int], is_anime: bool = True) -> List[Dict[str, Any]]:
    if len(tipos_am) == 1:  # Si solo tiene un elemento
        if (is_anime and tipos_am[0] != TipoAnimeEnum.desconocido) or (
            not is_anime and tipos_am[0] != TipoMangaEnum.desconocido
        ):
            return [
                {
                    "$match": {"tipo": tipos_am[0]},
                }
            ]
        else:
            return []
    else:
        orr_arr = [{"tipo": cond} for cond in tipos_am]
        return [{"$match": {"$or": [*orr_arr]}}] if len(orr_arr) > 0 else []

# Filtrado para animes y mangas incompletos
def filtrado_info_incompleta(is_to_update: bool = False) -> List[Dict[str, Any]]:
    and_query = [
        {"id_MAL": {"$not": {"$eq": None}}} if is_to_update else {},
        {"linkMAL": {"$eq": None}},
    ]
    return [{"$match": {"$and": and_query}}]

# Limitacion, paginado y ordenacion de la informacion
def apply_paginacion_ordenacion(
    limit: int = 20,
    pagina: int = 1,
    ordBy: OrderByEnum = OrderByEnum.asc,
    ordField: str = "",
    is_anime: bool = True,
) -> List[Dict[str, Any]]:

    # Si se pretende ordenar por el key de la coleccion,  se debe identificar si es de animes o mangas
    if ordField == FieldOrdEnum.key:
        ordField = "key_anime" if is_anime else "key_manga"

    # Preparamos la query de ordenacion
    ord_query = {"$sort": {ordField: ordBy}}

    # Preparamos la pipe de paginacion y limitacion
    pipe_pag = [{"$skip": (pagina - 1) * limit}, {"$limit": limit}]

    return [ord_query, *pipe_pag]
