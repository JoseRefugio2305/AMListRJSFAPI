from beanie import Document
from pydantic import Field, HttpUrl, AfterValidator
from typing import Optional, List, Annotated
from pymongo import IndexModel, ASCENDING

from app.core.utils import (
    httpurl_to_str,
    time_now_formatted,
    object_id_to_str,
)
from app.schemas.anime import (
    TipoAnimeEnum,
    StatusViewEnum,
    EstadoEmEnum,
    AnimeSchema,
    AnimeIncompleteSchema,
)
from app.schemas.common.images import MediaImagesSchema
from app.schemas.common.genres import GenreARelSchema
from app.schemas.common.relations import (
    AdaptacionSchema,
    StudiosARelSchema,
    AltTitlesSchema,
    AnimeRelTypeIncompleteSchema,
)


class AnimeModel(Document):
    key_anime: int = Field(..., ge=1)
    id_MAL: Optional[int] = None

    titulo: str
    link_p: Annotated[HttpUrl, AfterValidator(httpurl_to_str)] = Field(...)
    tipo: TipoAnimeEnum = Field(TipoAnimeEnum.anime)
    linkMAL: Optional[HttpUrl] = None
    fechaAdicion: str = time_now_formatted(True)

    animeImages: Optional[MediaImagesSchema] = None
    calificacion: Optional[float] = Field(default=None, ge=0, le=10)
    descripcion: Optional[str] = None
    emision: Optional[EstadoEmEnum] = None
    episodios: Optional[float] = Field(default=None, ge=0)
    fechaEmision: Optional[str] = None
    numRatings: Optional[int] = Field(default=None, ge=0)
    generos: Optional[List[GenreARelSchema]] = []
    relaciones: Optional[List[AnimeRelTypeIncompleteSchema]] = []
    adaptaciones: Optional[List[AdaptacionSchema]] = []
    studios: Optional[List[StudiosARelSchema]] = []
    titulos_alt: Optional[List[AltTitlesSchema]] = []
    isFav: Optional[bool] = Field(default=False, exclude=True)
    statusView: Optional[StatusViewEnum] = Field(default=None, exclude=True)

    class Settings:
        name = "animes" 
        indexes = [
            IndexModel([("key_anime", ASCENDING)], unique=True, name="key_anime_idx"),
            IndexModel(
                [("id_MAL", ASCENDING)],
                unique=True,
                partialFilterExpression={"id_MAL": {"$type": "number"}},
                name="id_MAL_anime_idx",
            ),
        ]

    ##Convertir el dict de bdd a un schema de ANimeSchema
    @classmethod
    def to_anime(
        cls, anime: dict, is_User: bool = False, is_Full: bool = False
    ) -> AnimeSchema:
        anime = object_id_to_str(anime)
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

    @classmethod
    def to_incomplete_anime(cls, incomanime: dict) -> AnimeIncompleteSchema:
        incomanime = object_id_to_str(incomanime)
        return AnimeIncompleteSchema(
            id=incomanime.get("_id") or incomanime.get("id") or incomanime.get("Id"),
            key_anime=incomanime.get("key_anime"),
            titulo=incomanime.get("titulo"),
            link_p=incomanime.get("link_p"),
            id_MAL=incomanime.get("id_MAL", None),
            tipo=incomanime.get("tipo"),
        )
