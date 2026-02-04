from typing import Optional

from app.repositories.stats import StatsRepository
from app.schemas.auth import UserLogRespSchema
from app.schemas.stats import (
    FavsCountSchema,
    StatsSchema,
    TypeStatisticEnum,
    ConteoGeneralSchema,
)
from app.core.logging import get_logger

logger = get_logger(__name__)


class StatsService:

    ##Obtener los conteos de animes y mangas en favoritos, divididos en estado de visualizacion
    @staticmethod
    async def get_count_favs(user: UserLogRespSchema) -> FavsCountSchema:
        conteoMangas, conteoAnimes = await StatsRepository.get_cont_favs(user.id)

        conteoSchema = FavsCountSchema(
            conteos_statusA=conteoAnimes, conteos_statusM=conteoMangas
        )

        # Obtenemos el total de animes y mangas en favoritos
        conteoSchema.totalMangas = sum(cm.conteo for cm in conteoSchema.conteos_statusM)
        conteoSchema.totalAnimes = sum(ca.conteo for ca in conteoSchema.conteos_statusA)
        return conteoSchema

    # Obtenemos las estadisticas
    @staticmethod
    async def get_stats(
        only_Favs: bool = False,
        user: Optional[UserLogRespSchema] = None,
        typeStat: TypeStatisticEnum = TypeStatisticEnum.tipo_a_m,
    ) -> StatsSchema:
        tiposAnime, tiposManga, porGenero, topEditorials, topStudios = (
            await StatsRepository.get_stats(only_Favs, user, typeStat)
        )
        return StatsSchema(
            tiposAnime=tiposAnime,
            tiposManga=tiposManga,
            conteoGeneros=porGenero,
            topStudios=topStudios,
            topEditorials=topEditorials,
        )

    # Conteos generales para al admin dashboard
    @staticmethod
    async def get_general_count() -> ConteoGeneralSchema:
        conteosGenerales = await StatsRepository.get_conteos_generales()
        if len(conteosGenerales) > 0:

            return ConteoGeneralSchema(
                totalAnimes=conteosGenerales[0].get("totalAnimes"),
                totalMangas=conteosGenerales[0].get("totalMangas"),
                totalAutoresMangas=conteosGenerales[0].get("totalAutoresMangas"),
                totalEdtManga=conteosGenerales[0].get("totalEdtManga"),
                totalGeneros=conteosGenerales[0].get("totalGeneros"),
                totalStdAnime=conteosGenerales[0].get("totalStdAnime"),
                totalUsuarios=conteosGenerales[0].get("totalUsuarios"),
            )
        else:
            return ConteoGeneralSchema()
