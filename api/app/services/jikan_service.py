from jikan4snek import Jikan4SNEK
from app.schemas.search import TipoContMALEnum
from app.schemas.anime import AnimeSchema
from typing import List, Dict

from app.core.logging import get_logger

logger = get_logger(__name__)


# Servicios de Jikan
class JikanService:
    # Buscar por titulo en MAL
    @staticmethod
    async def search_mal(
        titulo: str, tipo: TipoContMALEnum = TipoContMALEnum.anime
    ) -> Dict:
        jikan = Jikan4SNEK()
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
        jikan = Jikan4SNEK()
        animedata = await jikan.get(
            id_MAL, entry="full"
        ).anime()  # Obtenemos toda la informacion dle anime

        if "data" not in animedata:
            return None
        
        animedata=animedata.get("data")

        # logger.debug(animedata)
        # logger.debug("       ")

        dict_anime = {
            "id_MAL": id_MAL,
            "linkMAL": animedata.get("url"),
            "animeImages": [{
                "img_sm": animedata.get("images", {})
                .get("jpg", {})
                .get("image_url", {}),
                "img_l": animedata.get("images", {})
                .get("jpg", {})
                .get("large_image_url", {}),
            }],
            "titulos_alt": [
                {"tit_alt": tit.get("title"), "tipo": animedata.get("type")}
                for tit in animedata.get("titles")
            ],
            "titulo": animedata.get("title"),
            "calificacion": animedata.get("score"),
            "descripcion": animedata.get("synopsis"),
            "emision": 1 if animedata.get("airing") else 0,
            "episodios": animedata.get("episodes"),
            "fechaEmision": animedata.get("aired", {}).get("from").split("T")[0],
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
                for entry in rel.get("entry"):
                    dict_anime["relaciones"].append(
                        {
                            "id_MAL": entry.get("mal_id"),
                            "titulo": entry.get("name"),
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

        # logger.debug(dict_anime)

        return dict_anime
        # return animedata
