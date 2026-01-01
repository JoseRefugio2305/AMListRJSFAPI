from .db_helpers import lookup_user_favorites
from typing import Optional, List, Any, Dict


# Obtener pipeline para estadisticas de tipos de animes
def statsTipo(
    only_Favs: bool = False,
    userId: Optional[str] = None,
    field: str = "anime",
    collectionFavs: str = "utafavs",
    collectionTypes: str = "tipoanimes",
) -> List[Dict[str, Any]]:
    pipelineFavs = (
        lookup_user_favorites(
            userId,
            field,
            collectionFavs,
            True,
        )
        if only_Favs
        else []
    )
    return [
        {"$match": {"linkMAL": {"$not": {"$eq": None}}}},
        *pipelineFavs,
        {"$group": {"_id": "$tipo", "conteo": {"$count": {}}}},
        {
            "$lookup": {
                "from": collectionTypes,
                "localField": "_id",
                "foreignField": "code",
                "as": f"tipo_{field}",
                "pipeline": [{"$project": {"_id": 0, "nombre": 1}}],
            }
        },
        {"$unwind": f"$tipo_{field}"},
        {"$replaceRoot": {"newRoot": {"$mergeObjects": ["$$ROOT", f"$tipo_{field}"]}}},
        {"$unset": f"tipo_{field}"},
        {"$project": {"_id": 0, "code": "$_id", "conteo": 1, "nombre": 1}},
        {"$sort": {"code": 1}},
    ]


# Estadisticas por genero
def statsGenero(
    only_Favs: bool = False, userId: Optional[str] = None
) -> List[Dict[str, Any]]:
    pipeFavsA = (
        lookup_user_favorites(
            userId,
            "anime",
            "utafavs",
            True,
        )
        if only_Favs
        else []
    )
    pipeFavsM = (
        lookup_user_favorites(
            userId,
            "manga",
            "utmanfavs",
            True,
        )
        if only_Favs
        else []
    )
    return [
        {
            "$lookup": {
                "from": "animes",
                "localField": "id_MAL",
                "foreignField": "generos.id_MAL",
                "as": "animes_b_g",
                "pipeline": [
                    *pipeFavsA,
                    {"$project": {"_id": 0, "titulo": 1}},
                ],
            }
        },
        {
            "$lookup": {
                "from": "mangas",
                "localField": "id_MAL",
                "foreignField": "generos.id_MAL",
                "as": "mangas_b_g",
                "pipeline": [
                    *pipeFavsM,
                    {
                        "$project": {
                            "_id": 0,
                            "titulo": 1,
                        }
                    },
                ],
            }
        },
        {
            "$project": {
                "_id": 0,
                "id_MAL": 1,
                "nombre": 1,
                "conteomangas": {"$size": "$mangas_b_g"},
                "conteoanimes": {"$size": "$animes_b_g"},
            }
        },
        {"$sort": {"id_MAL": 1}},
    ]


# Estadisticas de top estudios de animacion
def topEstudios(
    only_Favs: bool = False, userId: Optional[str] = None
) -> List[Dict[str, Any]]:
    pipelineFavs = (
        lookup_user_favorites(
            userId,
            "anime",
            "utafavs",
            True,
        )
        if only_Favs
        else []
    )
    return [
        {
            "$lookup": {
                "from": "animes",
                "localField": "id_MAL",
                "foreignField": "studios.id_MAL",
                "as": "animes_b_std",
                "pipeline": [
                    *pipelineFavs,
                    {
                        "$project": {
                            "_id": 0,
                            "titulo": 1,
                        }
                    },
                ],
            }
        },
        {
            "$project": {
                "_id": 0,
                "id_MAL": 1,
                "nombre": 1,
                "conteoanimes": {"$size": "$animes_b_std"},
            }
        },
        {"$sort": {"conteoanimes": -1}},
        {"$limit": 10},
    ]


# Top editoriales
def topEditoriales(
    only_Favs: bool = False, userId: Optional[str] = None
) -> List[Dict[str, Any]]:
    pipelineFavs = (
        lookup_user_favorites(
            userId,
            "manga",
            "utmanfavs",
            True,
        )
        if only_Favs
        else []
    )
    return [
        {
            "$lookup": {
                "from": "mangas",
                "localField": "id_MAL",
                "foreignField": "editoriales.id_MAL",
                "as": "mangas_b_edt",
                "pipeline": [
                    *pipelineFavs,
                    {
                        "$project": {
                            "_id": 0,
                            "titulo": 1,
                        }
                    },
                ],
            }
        },
        {
            "$project": {
                "_id": 0,
                "id_MAL": 1,
                "nombre": 1,
                "conteomangas": {"$size": "$mangas_b_edt"},
            }
        },
        {"$sort": {"conteomangas": -1}},
        {"$limit": 10},
    ]
