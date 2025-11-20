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


# Filtrado de busqueda avanzada en mangas
def filtrado_busqueda_avanzada_manga(filtros: FilterSchema) -> List[Dict[str, Any]]:
    condiciones_busqueda = [
        # Evaluamos si esta haciendo buqueda por titulo, hacemos comparaciones con regex en titulo y titulos alternativos
        (
            {
                "$or": [
                    {"tit_search": {"$regex": filtros.tituloBusq}},
                    {"titulos_alt_search.tit_alt": {"$regex": filtros.tituloBusq}},
                ]
            }
            if len(filtros.tituloBusq) > 0
            else {}
        ),
        # Generos
        (
            {"generos.id_MAL": {"$in": filtros.generos}}
            if len(filtros.generos) > 0
            else {}
        ),
        # Editoriales
        (
            {"editoriales.id_MAL": {"$in": filtros.mangaEditoriales}}
            if len(filtros.mangaEditoriales) > 0
            else {}
        ),
        # Autores
        (
            {"autores.id_MAL": {"$in": filtros.mangaAutores}}
            if len(filtros.mangaAutores) > 0
            else {}
        ),
    ]
    pipeline = [
        {
            "$project": {
                "titulo": 1,
                "tipo": 1,
                "key_manga": 1,
                "publicando": 1,
                "capitulos": 1,
                "descripcion": {"$substrCP": ["$descripcion", 0, 50]},
                "link_p": 1,
                "calificacion": 1,
                "id_MAL": 1,
                "linkMAL": 1,
                "numRatings": 1,
                "titulos_alt": 1,
                "fechaComienzoPub": 1,
                "fechaFinPub": 1,
                "fechaAdicion": 1,
                # Titulo y titulos alternativos se convierten a minusculas para las comparaciones
                "tit_search": {"$toLower": "$titulo"},
                "titulos_alt_search": {
                    "$map": {
                        "input": "$titulos_alt",
                        "as": "arr_tits",
                        "in": {
                            "$mergeObjects": [
                                "$$arr_tits",
                                {"tit_alt": {"$toLower": "$$arr_tits.tit_alt"}},
                            ]
                        },
                    }
                },
                "generos": 1,
                "editoriales": 1,
                "autores": 1,
                "mangaImages": 1,
                "adaptaciones": 1,
            }
        },
        {"$match": {"$and": condiciones_busqueda}},
    ]
    return pipeline


# Filtrado de busqueda avanzada en animes
def filtrado_busqueda_avanzada_anime(filtros: FilterSchema) -> List[Dict[str, Any]]:
    condiciones_busqueda = [
        (  # Evaluamos si esta haciendo buqueda por titulo, hacemos comparaciones con regex en titulo y titulos alternativos
            {
                "$or": [
                    {"tit_search": {"$regex": filtros.tituloBusq}},
                    {"titulos_alt_search.tit_alt": {"$regex": filtros.tituloBusq}},
                ]
            }
            if len(filtros.tituloBusq) > 0
            else {}
        ),
        # Generos
        (
            {"generos.id_MAL": {"$in": filtros.generos}}
            if len(filtros.generos) > 0
            else {}
        ),
        # Estudios de animacion
        (
            {"studios.id_MAL": {"$in": filtros.animeEstudios}}
            if len(filtros.animeEstudios)
            else {}
        ),
    ]
    pipeline = [
        {
            "$project": {
                "titulo": 1,
                "tipo": 1,
                "key_anime": 1,
                "emision": 1,
                "episodios": 1,
                "descripcion": {"$substrCP": ["$descripcion", 0, 50]},
                "fechaEmision": 1,
                "fechaAdicion": 1,
                "link_p": 1,
                "calificacion": 1,
                "id_MAL": 1,
                "linkMAL": 1,
                "numRatings": 1,
                "titulos_alt": 1,
                "tit_search": {"$toLower": "$titulo"},
                "titulos_alt_search": {
                    "$map": {
                        "input": "$titulos_alt",
                        "as": "arr_tits",
                        "in": {
                            "$mergeObjects": [
                                "$$arr_tits",
                                {"tit_alt": {"$toLower": "$$arr_tits.tit_alt"}},
                            ]
                        },
                    }
                },
                "generos": 1,
                "studios": 1,
                "animeImages": 1,
            }
        },
        {"$match": {"$and": condiciones_busqueda}},
    ]
    return pipeline


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


# Obtener la informacion full de un manga
def get_full_manga() -> List[Dict[str, Any]]:
    return [
        {
            "$lookup": {
                "from": "animes",
                "localField": "adaptaciones.id_MAL",
                "foreignField": "id_MAL",
                "as": "adaptaciones",
                "pipeline": [
                    {"$match": {"linkMAL": {"$not": {"$eq": None}}}},
                    {
                        "$project": {
                            "_id": 0,
                            "id_MAL": 1,
                            "key_anime": 1,
                            "titulo": 1,
                            "animeImages": 1,
                        }
                    },
                ],
            }
        },
        {
            "$lookup": {
                "from": "mangas",
                "localField": "relaciones.id_MAL",
                "foreignField": "id_MAL",
                "as": "relaciones",
                "pipeline": [
                    {"$match": {"linkMAL": {"$not": {"$eq": None}}}},
                    {
                        "$project": {
                            "_id": 0,
                            "id_MAL": 1,
                            "key_manga": 1,
                            "titulo": 1,
                            "mangaImages": 1,
                        }
                    },
                ],
            }
        },
    ]


# Obtener la informacion completa del anime
def get_full_anime() -> List[Dict[str, Any]]:
    return [
        {
            "$lookup": {
                "from": "animes",
                "localField": "relaciones.id_MAL",
                "foreignField": "id_MAL",
                "as": "relaciones",
                "pipeline": [
                    {"$match": {"linkMAL": {"$not": {"$eq": None}}}},
                    {
                        "$project": {
                            "_id": 0,
                            "id_MAL": 1,
                            "key_anime": 1,
                            "titulo": 1,
                            "animeImages": 1,
                        }
                    },
                ],
            }
        },
        {
            "$lookup": {
                "from": "mangas",
                "localField": "adaptaciones.id_MAL",
                "foreignField": "id_MAL",
                "as": "adaptaciones",
                "pipeline": [
                    {"$match": {"linkMAL": {"$not": {"$eq": None}}}},
                    {
                        "$project": {
                            "_id": 0,
                            "id_MAL": 1,
                            "key_manga": 1,
                            "titulo": 1,
                            "mangaImages": 1,
                        }
                    },
                ],
            }
        },
    ]
