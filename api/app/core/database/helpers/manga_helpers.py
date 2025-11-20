from typing import List, Dict, Any

from app.schemas.search import FilterSchema


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
