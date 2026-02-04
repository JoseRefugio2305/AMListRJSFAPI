from fastapi import HTTPException, status
from typing import Optional
import math

from app.schemas.anime import AnimeSchema
from app.schemas.common.relations import StudiosSchema
from app.schemas.search import (
    AnimeSearchSchema,
    FilterSchema,
    SearchAnimeIncompleteSchema,
    ReadyToMALEnum,
    FilterGSAESchema,
    SearchStudiosSchema,
)
from app.schemas.auth import UserLogRespSchema
from app.core.utils import (
    objects_id_list_to_str,
    to_anime,
    to_incomplete_anime,
)
from app.repositories.anime import AnimeRepository
from app.core.logging import get_logger

logger = get_logger(__name__)


class AnimeService:

    # Encontrar la lista de animes por pagina de busqueda, solo se obtendran los que estan finalizados
    @staticmethod
    async def get_all(
        filters: FilterSchema, user: Optional[UserLogRespSchema] = None
    ) -> AnimeSearchSchema:
        user_id = user.id if user else None
        results, totalAnimes = await AnimeRepository.find_all_filtered(filters, user_id)

        return AnimeSearchSchema(
            listaAnimes=[to_anime(r, user is not None, False) for r in results],
            pageA=filters.page,
            totalPagesA=math.ceil(totalAnimes / filters.limit),
            totalAnimes=totalAnimes,
        )

    # Detalles del anime
    @staticmethod
    async def get_anime_by_id(
        key_anime: int, user: Optional[UserLogRespSchema] = None
    ) -> AnimeSchema:
        user_id = user.id if user else None
        anime = await AnimeRepository.get_anime_by_key(key_anime, user_id)

        if not anime:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Anime no encontrado",
            )
        return to_anime(anime, user is not None, True)

    # Obtener los animes que no estan actualizados con su informaicon de MAL
    @staticmethod
    async def get_incomplete_animes(
        filters: FilterSchema, ready_to_mal: ReadyToMALEnum = ReadyToMALEnum.todos
    ) -> SearchAnimeIncompleteSchema:
        results, totalAnimes = await AnimeRepository.find_all_incomplete_filtered(
            filters, ready_to_mal
        )

        results = [to_incomplete_anime(a) for a in results]

        return SearchAnimeIncompleteSchema(
            listaAnimes=results,
            totalAnimes=totalAnimes,
            totalPages=math.ceil(totalAnimes / filters.limit),
            page=filters.page,
        )

    # Busqueda de estudios de animacion
    @staticmethod
    async def studios_list(filters: FilterGSAESchema) -> SearchStudiosSchema:
        studios, totalStudios = await AnimeRepository.get_studios(filters)
        studios = objects_id_list_to_str(studios)

        list_Studios = [
            StudiosSchema(
                nombre=std.get("nombre"),
                id=std.get("_id") or std.get("id") or std.get("Id"),
                id_MAL=std.get("id_MAL"),
                linkMAL=std.get("linkMAL"),
                fechaAdicion=str(std.get("fechaAdicion")),
            )
            for std in studios
        ]

        return SearchStudiosSchema(
            lista=list_Studios,
            total=totalStudios,
            page=filters.page,
            totalPages=math.ceil(totalStudios / filters.limit),
        )
