from app.schemas.anime import AnimeSchema, AnimeIncompleteSchema


##Convertir el dict de bdd a un schema de ANimeSchema
def dict_to_anime_schema(
    anime: dict, is_User: bool = False, is_Full: bool = False
) -> AnimeSchema:
    return AnimeSchema(
        id=anime.get("_id") or anime.get("id") or anime.get("Id"),
        key_anime=anime.get("key_anime"),
        titulo=anime.get("titulo"),
        link_p=anime.get("link_p"),
        tipo=anime.get("tipo"),
        animeImages=anime.get("animeImages"),
        calificacion=anime.get("calificacion"),
        descripcion=anime.get("descripcion"),
        emision=anime.get("emision"),
        episodios=anime.get("episodios") if anime.get("episodios") else 0,
        fechaAdicion=str(anime.get("fechaAdicion")),
        fechaEmision=str(anime.get("fechaEmision")),
        generos=anime.get("generos") if is_Full else None,
        id_MAL=anime.get("id_MAL"),
        linkMAL=anime.get("linkMAL"),
        numRatings=anime.get("numRatings"),
        relaciones=anime.get("relaciones") if is_Full else None,
        adaptaciones=anime.get("adaptaciones") if is_Full else None,
        studios=anime.get("studios") if is_Full else None,
        titulos_alt=anime.get("titulos_alt") if is_Full else None,
        isFav=anime.get("is_fav") if is_User else False,
        statusView=anime.get("statusView") if is_User else None,
    )


def dict_to_incomplete_anime(incomanime: dict) -> AnimeIncompleteSchema:
    return AnimeIncompleteSchema(
        id=incomanime.get("_id") or incomanime.get("id") or incomanime.get("Id"),
        key_anime=incomanime.get("key_anime"),
        titulo=incomanime.get("titulo"),
        link_p=incomanime.get("link_p"),
        id_MAL=incomanime.get("id_MAL", None),
        tipo=incomanime.get("tipo"),
    )
