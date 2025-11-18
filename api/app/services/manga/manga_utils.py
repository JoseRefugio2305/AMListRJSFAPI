from app.schemas.manga import MangaSchema, MangaIncompleteSchema


##Convertir el dict de bdd a un schema de ANimeSchema
def dict_to_manga_schema(manga: dict, is_User: bool = False) -> MangaSchema:
    return MangaSchema(
        id=manga.get("_id") or manga.get("id") or manga.get("Id"),
        key_manga=manga.get("key_manga"),
        titulo=manga.get("titulo"),
        link_p=manga.get("link_p"),
        tipo=manga.get("tipo"),
        mangaImages=manga.get("mangaImages"),
        calificacion=manga.get("calificacion"),
        descripcion=manga.get("descripcion"),
        publicando=manga.get("publicando"),
        capitulos=manga.get("capitulos") if manga.get("capitulos") else 0,
        volumenes=manga.get("volumenes") if manga.get("volumenes") else 0,
        fechaAdicion=str(manga.get("fechaAdicion")),
        fechaComienzoPub=str(manga.get("fechaComienzoPub")),
        fechaFinPub=str(manga.get("fechaFinPub")),
        generos=manga.get("generos"),
        id_MAL=manga.get("id_MAL"),
        linkMAL=manga.get("linkMAL"),
        numRatings=manga.get("numRatings"),
        relaciones=manga.get("relaciones"),
        editoriales=manga.get("editoriales"),
        autores=manga.get("autores"),
        adaptaciones=manga.get("adaptaciones"),
        titulos_alt=manga.get("titulos_alt"),
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
