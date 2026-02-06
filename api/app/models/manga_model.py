from beanie import Document
from pydantic import Field, HttpUrl, AfterValidator
from typing import Optional, List, Annotated
from pymongo import IndexModel, ASCENDING

from app.core.utils import (
    httpurl_to_str,
    time_now_formatted,
    object_id_to_str,
)
from app.schemas.manga import TipoMangaEnum, MangaSchema, MangaIncompleteSchema
from app.schemas.anime import EstadoEmEnum, StatusViewEnum
from app.schemas.common.images import MediaImagesSchema
from app.schemas.common.genres import GenreARelSchema
from app.schemas.common.relations import (
    AdaptacionSchema,
    AltTitlesSchema,
    MangaRelTypeIncompleteSchema,
    EditorialMRelSchema,
    AutoresMRelSchema,
)


class MangaModel(Document):
    key_manga: int = Field(..., ge=1)
    id_MAL: Optional[int] = None

    titulo: str
    link_p: Annotated[HttpUrl, AfterValidator(httpurl_to_str)] = Field(...)
    tipo: TipoMangaEnum = Field(TipoMangaEnum.manga)
    linkMAL: Optional[HttpUrl] = None
    fechaAdicion: str = time_now_formatted(True)

    mangaImages: Optional[MediaImagesSchema] = None
    calificacion: Optional[float] = Field(default=None, ge=0, le=10)
    descripcion: Optional[str] = None
    publicando: Optional[EstadoEmEnum] = None
    capitulos: Optional[float] = Field(default=None, ge=0)
    volumenes: Optional[int] = Field(default=None, ge=0)
    fechaAdicion: Optional[str] = None
    fechaComienzoPub: Optional[str] = None
    fechaFinPub: Optional[str] = None
    numRatings: Optional[int] = Field(default=None, ge=0)
    generos: Optional[List[GenreARelSchema]] = []
    relaciones: Optional[List[MangaRelTypeIncompleteSchema]] = []
    adaptaciones: Optional[List[AdaptacionSchema]] = []
    editoriales: Optional[List[EditorialMRelSchema]] = []
    autores: Optional[List[AutoresMRelSchema]] = []
    titulos_alt: Optional[List[AltTitlesSchema]] = []
    isFav: Optional[bool] = Field(default=False, exclude=True)
    statusView: Optional[StatusViewEnum] = Field(default=None, exclude=True)

    class Settings:
        name = "mangas"
        indexes = [
            IndexModel([("key_manga", ASCENDING)], unique=True, name="key_manga_idx"),
            IndexModel(
                [("id_MAL", ASCENDING)],
                unique=True,
                partialFilterExpression={"id_MAL": {"$type": "number"}},
                name="id_MAL_manga_idx",
            ),
        ]

    ##Convertir el dict de bdd a un schema de ANimeSchema
    @classmethod
    def to_manga(cls, manga: dict, is_User: bool = False, is_Full=False) -> MangaSchema:
        manga = object_id_to_str(manga)
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

    @classmethod
    def to_incomplete_manga(cls, inconmanga: dict) -> MangaIncompleteSchema:
        inconmanga = object_id_to_str(inconmanga)
        return MangaIncompleteSchema(
            id=inconmanga.get("_id") or inconmanga.get("id") or inconmanga.get("Id"),
            key_manga=inconmanga.get("key_manga"),
            titulo=inconmanga.get("titulo"),
            link_p=inconmanga.get("link_p"),
            id_MAL=inconmanga.get("id_MAL", None),
            tipo=inconmanga.get("tipo"),
        )
