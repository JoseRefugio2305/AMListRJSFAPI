from bson.objectid import ObjectId

from app.models.anime_model import AnimeModel
from app.models.manga_model import MangaModel
from app.models.utafavs_model import UTAFavsModel
from app.models.utmanfavs_model import UTManFavsModel
from app.models.genero_model import GeneroModel
from app.models.studio_model import StudioModel
from app.models.editorial_model import EditorialModel
from app.schemas.auth import UserLogRespSchema
from app.schemas.stats import FavsCountSchema, StatsSchema, TypeStatisticEnum
from app.core.database import statsGenero, statsTipo, topEditoriales, topEstudios

from app.core.logging import get_logger

logger = get_logger(__name__)


class StatsService:

    ##Obtener los conteos de animes y mangas en favoritos, divididos en estado de visualizacion
    @staticmethod
    async def get_count_favs(user: UserLogRespSchema) -> FavsCountSchema:
        conteoMangas = await UTManFavsModel.aggregate(
            [
                {"$match": {"$and": [{"user": ObjectId(user.id)}, {"active": True}]}},
                {"$group": {"_id": "$statusView", "conteo": {"$count": {}}}},
                {"$project": {"_id": 0, "statusView": "$_id", "conteo": 1}},
                {"$sort": {"statusView": 1}},
            ]
        )
        conteoAnimes = await UTAFavsModel.aggregate(
            [
                {"$match": {"$and": [{"user": ObjectId(user.id)}, {"active": True}]}},
                {"$group": {"_id": "$statusView", "conteo": {"$count": {}}}},
                {"$project": {"_id": 0, "statusView": "$_id", "conteo": 1}},
                {"$sort": {"statusView": 1}},
            ]
        )

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
        user: UserLogRespSchema,
        typeStat: TypeStatisticEnum = TypeStatisticEnum.tipo_a_m,
    ) -> StatsSchema:
        tiposAnime = []
        tiposManga = []
        porGenero = []
        topEditorials = []
        topStudios = []
        match typeStat:
            case TypeStatisticEnum.tipo_a_m:
                tiposAnime = await AnimeModel.aggregate(
                    statsTipo(True, user.id, "anime", "utafavs", "tipoanimes")
                )
                tiposManga = await MangaModel.aggregate(
                    statsTipo(True, user.id, "manga", "utmanfavs", "tipomangas")
                )
            case TypeStatisticEnum.generos:
                porGenero = await GeneroModel.aggregate(statsGenero(True, user.id))
            case TypeStatisticEnum.studios:
                topStudios = await StudioModel.aggregate(topEstudios(True, user.id))
            case _:
                topEditorials = await EditorialModel.aggregate(
                    topEditoriales(True, user.id)
                )
        return StatsSchema(
            tiposAnime=tiposAnime,
            tiposManga=tiposManga,
            conteoGeneros=porGenero,
            topStudios=topStudios,
            topEditorials=topEditorials,
        )
