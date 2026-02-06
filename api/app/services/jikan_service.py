from jikan4snek import Jikan4SNEK
from app.schemas.search import TipoContMALEnum
from typing import Dict, List

from app.core.logging import get_logger

logger = get_logger(__name__)


def get_jikan_client():
    return Jikan4SNEK()


def get_genres_am(genres_list: List[Dict]) -> List[Dict]:
    list_genres = []
    for gen in genres_list:
        list_genres.append(
            {
                "id_MAL": gen.get("mal_id"),
                "nombre": gen.get("name"),
                "nombre_mal": gen.get("name"),
                "linkMAL": gen.get("url"),
            }
        )
    return list_genres


# Servicios de Jikan
class JikanService:
    # Buscar por titulo en MAL
    @staticmethod
    async def search_mal(
        titulo: str, tipo: TipoContMALEnum = TipoContMALEnum.anime
    ) -> Dict:
        jikan = get_jikan_client()
        results = []
        # Realizamos la busqueda dependiendo del tipo de contenido
        if TipoContMALEnum.anime == tipo:
            results = await jikan.search(query=titulo, limit=10).anime()
        else:
            results = await jikan.search(query=titulo, limit=10).manga()
        return results

    # Obtener la informacion completa de un anime
    @staticmethod
    async def get_data_anime(id_MAL: int) -> Dict:
        jikan = get_jikan_client()
        animedata = await jikan.get(
            id_MAL, entry="full"
        ).anime()  # Obtenemos toda la informacion dle anime

        if "data" not in animedata:
            return None

        animedata = animedata.get("data")

        # logger.debug(animedata)
        # logger.debug("       ")
        fecha = animedata.get("aired", {}).get("from")
        dict_anime = {
            "id_MAL": id_MAL,
            "linkMAL": animedata.get("url"),
            "animeImages": {
                "img_sm": animedata.get("images", {})
                .get("jpg", {})
                .get("small_image_url", {}),
                "img": animedata.get("images", {}).get("jpg", {}).get("image_url", {}),
                "img_l": animedata.get("images", {})
                .get("jpg", {})
                .get("large_image_url", {}),
            },
            "titulos_alt": [
                {"tit_alt": tit.get("title"), "tipo": animedata.get("type")}
                for tit in animedata.get("titles")
            ],
            "titulo": animedata.get("title"),
            "calificacion": animedata.get("score"),
            "descripcion": animedata.get("synopsis"),
            "emision": 1 if animedata.get("airing") else 0,
            "episodios": animedata.get("episodes"),
            "fechaEmision": fecha.split("T")[0] if fecha else None,
            "generos": [
                {
                    "id_MAL": gen.get("mal_id"),
                    "nombre": gen.get("name"),
                    "nombre_mal": gen.get("name"),
                    "linkMAL": gen.get("url"),
                }
                for gen in animedata.get("genres")
            ],
            "numRatings": animedata.get("scored_by"),
            "relaciones": [],
            "adaptaciones": [],
            "studios": [
                {
                    "nombre": std.get("name"),
                    "id_MAL": std.get("mal_id"),
                    "linkMAL": std.get("url"),
                }
                for std in animedata.get("studios")
            ],
        }

        for rel in animedata.get("relations"):
            if rel.get("relation") != "Adaptation":
                ani = []
                for entry in rel.get("entry"):
                    ani.append(
                        {
                            "id_MAL": entry.get("mal_id"),
                            "titulo": entry.get("name"),
                        }
                    )
                dict_anime["relaciones"].append(
                    {
                        "animes": ani,
                        "type_rel": rel.get("relation"),
                    }
                )
            else:
                for adp in rel.get("entry"):
                    dict_anime["adaptaciones"].append(
                        {
                            "id_MAL": adp.get("mal_id"),
                            "titulo": adp.get("name"),
                            "type_rel": rel.get("relation"),
                        }
                    )
        dict_anime["generos"].extend(get_genres_am(animedata.get("explicit_genres")))
        dict_anime["generos"].extend(get_genres_am(animedata.get("themes")))
        dict_anime["generos"].extend(get_genres_am(animedata.get("demographics")))
        # logger.debug(dict_anime)

        return dict_anime

    @staticmethod
    async def get_data_manga(id_MAL: int) -> Dict:
        jikan = get_jikan_client()
        mangadata = await jikan.get(
            id_MAL, entry="full"
        ).manga()  # Obtenemos toda la informacion del manga
        logger.debug(mangadata)

        if "data" not in mangadata:
            return None

        mangadata = mangadata.get("data")

        # logger.debug("       ")
        fechaComienzoPub = mangadata.get("published", {}).get("from")
        dict_manga = {
            "id_MAL": id_MAL,
            "linkMAL": mangadata.get("url"),
            "mangaImages": {
                "img_sm": mangadata.get("images", {})
                .get("jpg", {})
                .get("small_image_url", {}),
                "img": mangadata.get("images", {}).get("jpg", {}).get("image_url", {}),
                "img_l": mangadata.get("images", {})
                .get("jpg", {})
                .get("large_image_url", {}),
            },
            "titulos_alt": [
                {"tit_alt": tit.get("title"), "tipo": mangadata.get("type")}
                for tit in mangadata.get("titles")
            ],
            "titulo": mangadata.get("title"),
            "calificacion": mangadata.get("score"),
            "descripcion": mangadata.get("synopsis"),
            "publicando": 1 if mangadata.get("publishing") else 0,
            "capitulos": mangadata.get("chapters"),
            "volumenes": mangadata.get("volumes"),
            "fechaComienzoPub": (
                fechaComienzoPub.split("T")[0] if fechaComienzoPub else None
            ),
            "fechaFinPub": (
                mangadata.get("published", {}).get("to").split("T")[0]
                if mangadata.get("published", {}).get(
                    "to", None
                )  # Los mangas en publicacion no tiene  fecha de de finaizacion
                else None
            ),
            "generos": [
                {
                    "id_MAL": gen.get("mal_id"),
                    "nombre": gen.get("name"),
                    "nombre_mal": gen.get("name"),
                    "linkMAL": gen.get("url"),
                }
                for gen in mangadata.get("genres")
            ],
            "numRatings": mangadata.get("scored_by"),
            "relaciones": [],
            "adaptaciones": [],
            "editoriales": [
                {
                    "nombre": edt.get("name"),
                    "id_MAL": edt.get("mal_id"),
                    "linkMAL": edt.get("url"),
                    "tipo": edt.get("type"),
                }
                for edt in mangadata.get("serializations")
            ],
            "autores": [
                {
                    "nombre": auth.get("name"),
                    "id_MAL": auth.get("mal_id"),
                    "linkMAL": auth.get("url"),
                    "tipo": auth.get("type"),
                }
                for auth in mangadata.get("authors")
            ],
        }

        for rel in mangadata.get("relations"):
            if rel.get("relation") != "Adaptation":
                mang = []
                for entry in rel.get("entry"):
                    mang.append(
                        {
                            "id_MAL": entry.get("mal_id"),
                            "titulo": entry.get("name"),
                        }
                    )
                dict_manga["relaciones"].append(
                    {
                        "mangas": mang,
                        "type_rel": rel.get("relation"),
                    }
                )
            else:
                for adp in rel.get("entry"):
                    dict_manga["adaptaciones"].append(
                        {
                            "id_MAL": adp.get("mal_id"),
                            "titulo": adp.get("name"),
                            "type_rel": rel.get("relation"),
                        }
                    )
        dict_manga["generos"].extend(get_genres_am(mangadata.get("explicit_genres")))
        dict_manga["generos"].extend(get_genres_am(mangadata.get("themes")))
        dict_manga["generos"].extend(get_genres_am(mangadata.get("demographics")))

        return dict_manga
