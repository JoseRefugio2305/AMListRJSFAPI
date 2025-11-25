from typing import List, Dict, Any

from app.schemas.search import FilterSchema


# Filtrado de busqueda avanzada en animes
def filtrado_busqueda_avanzada_anime(filtros: FilterSchema) -> List[Dict[str, Any]]:
    condiciones_busqueda = [
        (  # Evaluamos si esta haciendo buqueda por titulo, hacemos comparaciones con regex en titulo y titulos alternativos
            {
                "$or": [
                    {"tit_search": {"$regex": filtros.tituloBusq, "$options": "i"}},
                    {
                        "titulos_alt_search.tit_alt": {
                            "$regex": filtros.tituloBusq,
                            "$options": "i",
                        }
                    },
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
