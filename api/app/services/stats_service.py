from bson.objectid import ObjectId
from typing import Optional

from app.models.anime_model import AnimeModel
from app.models.manga_model import MangaModel
from app.models.utafavs_model import UTAFavsModel
from app.models.utmanfavs_model import UTManFavsModel
from app.models.genero_model import GeneroModel
from app.models.studio_model import StudioModel
from app.models.editorial_model import EditorialModel
from app.schemas.auth import UserLogRespSchema
from app.schemas.stats import (
    FavsCountSchema,
    StatsSchema,
    TypeStatisticEnum,
    ConteoGeneralSchema,
)
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
        only_Favs: bool = False,
        user: Optional[UserLogRespSchema] = None,
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
                    statsTipo(
                        only_Favs,
                        user.id if user else None,
                        "anime",
                        "utafavs",
                        "tipoanimes",
                    )
                )
                tiposManga = await MangaModel.aggregate(
                    statsTipo(
                        only_Favs,
                        user.id if user else None,
                        "manga",
                        "utmanfavs",
                        "tipomangas",
                    )
                )
            case TypeStatisticEnum.generos:
                porGenero = await GeneroModel.aggregate(
                    statsGenero(only_Favs, user.id if user else None)
                )
            case TypeStatisticEnum.studios:
                topStudios = await StudioModel.aggregate(
                    topEstudios(only_Favs, user.id if user else None)
                )
            case _:
                topEditorials = await EditorialModel.aggregate(
                    topEditoriales(only_Favs, user.id if user else None)
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
        conteosGenerales = await AnimeModel.aggregate(
            [
                {"$count": "key_anime"},
                {"$project": {"totalAnimes": "$key_anime"}},
                {
                    "$lookup": {
                        "from": "mangas",
                        "pipeline": [{"$count": "key_manga"}],
                        "as": "totalMangas",
                    }
                },
                {
                    "$lookup": {
                        "from": "generos",
                        "pipeline": [{"$count": "id_MAL"}],
                        "as": "totalGeneros",
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "pipeline": [{"$count": "email"}],
                        "as": "totalUsuarios",
                    }
                },
                {
                    "$lookup": {
                        "from": "autors",
                        "pipeline": [{"$count": "id_MAL"}],
                        "as": "totalAutoresMangas",
                    }
                },
                {
                    "$lookup": {
                        "from": "editorials",
                        "pipeline": [{"$count": "id_MAL"}],
                        "as": "totalEdtManga",
                    }
                },
                {
                    "$lookup": {
                        "from": "studios",
                        "pipeline": [{"$count": "id_MAL"}],
                        "as": "totalStdAnime",
                    }
                },
                {
                    "$addFields": {
                        "totalMangas": {
                            "$ifNull": [
                                {"$arrayElemAt": ["$totalMangas.key_manga", 0]},
                                0,
                            ]
                        },
                        "totalGeneros": {
                            "$ifNull": [
                                {"$arrayElemAt": ["$totalGeneros.id_MAL", 0]},
                                0,
                            ]
                        },
                        "totalAutoresMangas": {
                            "$ifNull": [
                                {"$arrayElemAt": ["$totalAutoresMangas.id_MAL", 0]},
                                0,
                            ]
                        },
                        "totalEdtManga": {
                            "$ifNull": [
                                {"$arrayElemAt": ["$totalEdtManga.id_MAL", 0]},
                                0,
                            ]
                        },
                        "totalStdAnime": {
                            "$ifNull": [
                                {"$arrayElemAt": ["$totalStdAnime.id_MAL", 0]},
                                0,
                            ]
                        },
                        "totalUsuarios": {
                            "$ifNull": [
                                {"$arrayElemAt": ["$totalUsuarios.email", 0]},
                                0,
                            ]
                        },
                    }
                },
            ]
        )
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
