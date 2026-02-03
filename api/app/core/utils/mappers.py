from app.schemas.anime import AnimeSchema, AnimeIncompleteSchema
from app.schemas.manga import MangaSchema, MangaIncompleteSchema


##Convertir el dict de bdd a un schema de ANimeSchema
def to_anime(anime: dict, is_User: bool = False, is_Full: bool = False) -> AnimeSchema:
    return AnimeSchema(
        id=anime.get("_id") or anime.get("id") or anime.get("Id"),
        key_anime=anime.get("key_anime"),
        titulo=anime.get("titulo"),
        link_p=anime.get("link_p"),
        tipo=anime.get("tipo"),
        animeImages=anime.get("animeImages"),
        calificacion=anime.get("calificacion") if anime.get("calificacion") else 0,
        descripcion=anime.get("descripcion"),
        emision=anime.get("emision"),
        episodios=anime.get("episodios") if anime.get("episodios") else 0,
        fechaAdicion=str(anime.get("fechaAdicion")),
        fechaEmision=str(anime.get("fechaEmision")),
        generos=anime.get("generos") if is_Full else None,
        id_MAL=anime.get("id_MAL"),
        linkMAL=anime.get("linkMAL"),
        numRatings=anime.get("numRatings") if anime.get("numRatings") else 0,
        relaciones=anime.get("relaciones") if is_Full else None,
        adaptaciones=anime.get("adaptaciones") if is_Full else None,
        studios=anime.get("studios") if is_Full else None,
        titulos_alt=anime.get("titulos_alt") if is_Full else None,
        isFav=anime.get("is_fav") if is_User else False,
        statusView=anime.get("statusView") if is_User else None,
    )


def to_incomplete_anime(incomanime: dict) -> AnimeIncompleteSchema:
    return AnimeIncompleteSchema(
        id=incomanime.get("_id") or incomanime.get("id") or incomanime.get("Id"),
        key_anime=incomanime.get("key_anime"),
        titulo=incomanime.get("titulo"),
        link_p=incomanime.get("link_p"),
        id_MAL=incomanime.get("id_MAL", None),
        tipo=incomanime.get("tipo"),
    )


##Convertir el dict de bdd a un schema de ANimeSchema
def to_manga(manga: dict, is_User: bool = False, is_Full=False) -> MangaSchema:
    return MangaSchema(
        id=manga.get("_id") or manga.get("id") or manga.get("Id"),
        key_manga=manga.get("key_manga"),
        titulo=manga.get("titulo"),
        link_p=manga.get("link_p"),
        tipo=manga.get("tipo"),
        mangaImages=manga.get("mangaImages"),
        calificacion=manga.get("calificacion") if manga.get("calificacion") else 0,
        descripcion=manga.get("descripcion"),
        publicando=manga.get("publicando"),
        capitulos=manga.get("capitulos") if manga.get("capitulos") else 0,
        volumenes=manga.get("volumenes") if manga.get("volumenes") else 0,
        fechaAdicion=str(manga.get("fechaAdicion")),
        fechaComienzoPub=str(manga.get("fechaComienzoPub")),
        fechaFinPub=str(manga.get("fechaFinPub")),
        generos=manga.get("generos") if is_Full else None,
        id_MAL=manga.get("id_MAL"),
        linkMAL=manga.get("linkMAL"),
        numRatings=manga.get("numRatings") if manga.get("numRatings") else 0,
        relaciones=manga.get("relaciones") if is_Full else None,
        editoriales=manga.get("editoriales") if is_Full else None,
        autores=manga.get("autores") if is_Full else None,
        adaptaciones=manga.get("adaptaciones") if is_Full else None,
        titulos_alt=manga.get("titulos_alt") if is_Full else None,
        isFav=manga.get("is_fav") if is_User else False,
        statusView=manga.get("statusView") if is_User else None,
    )


def to_incomplete_manga(inconmanga: dict) -> MangaIncompleteSchema:
    return MangaIncompleteSchema(
        id=inconmanga.get("_id") or inconmanga.get("id") or inconmanga.get("Id"),
        key_manga=inconmanga.get("key_manga"),
        titulo=inconmanga.get("titulo"),
        link_p=inconmanga.get("link_p"),
        id_MAL=inconmanga.get("id_MAL", None),
        tipo=inconmanga.get("tipo"),
    )


def to_user(userInfo: dict, token: str):
    from app.schemas.auth import UserLogRespSchema, RolEnum

    return UserLogRespSchema(
        id=userInfo.get("_id") or userInfo.get("id") or userInfo.get("Id"),
        name=userInfo.get("name"),
        email=userInfo.get("email"),
        rol=userInfo.get("rol", RolEnum.base_user),
        is_active=userInfo.get("is_active", True),
        profile_pic=userInfo.get("profile_pic"),
        created_date=userInfo.get("created_date"),
        show_statistics=userInfo.get("show_statistics"),
        access_token=token,
    )
