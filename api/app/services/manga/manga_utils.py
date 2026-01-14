from app.schemas.manga import MangaSchema, MangaIncompleteSchema


##Convertir el dict de bdd a un schema de ANimeSchema
def dict_to_manga_schema(
    manga: dict, is_User: bool = False, is_Full=False
) -> MangaSchema:
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


def dict_to_incomplete_manga(inconmanga: dict) -> MangaIncompleteSchema:
    return MangaIncompleteSchema(
        id=inconmanga.get("_id") or inconmanga.get("id") or inconmanga.get("Id"),
        key_manga=inconmanga.get("key_manga"),
        titulo=inconmanga.get("titulo"),
        link_p=inconmanga.get("link_p"),
        id_MAL=inconmanga.get("id_MAL", None),
        tipo=inconmanga.get("tipo"),
    )
