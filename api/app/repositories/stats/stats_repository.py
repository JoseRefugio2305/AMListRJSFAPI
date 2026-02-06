from bson import ObjectId
from typing import Optional

from app.core.utils import ObjectIdStr
from app.schemas.auth import UserLogRespSchema
from app.models.utafavs_model import UTAFavsModel
from app.models.utmanfavs_model import UTManFavsModel
from app.models.genero_model import GeneroModel
from app.models.studio_model import StudioModel
from app.models.editorial_model import EditorialModel
from app.models.anime_model import AnimeModel
from app.models.manga_model import MangaModel
from app.schemas.stats import TypeStatisticEnum
from ..pipeline_builders.stats import (
    statsGenero,
    statsTipo,
    topEditoriales,
    topEstudios,
)


class StatsRepository:
    @staticmethod
    async def get_cont_favs(user_id: ObjectIdStr):
        conteo_mangas = await UTManFavsModel.aggregate(
            [
                {"$match": {"$and": [{"user": ObjectId(user_id)}, {"active": True}]}},
                {"$group": {"_id": "$statusView", "conteo": {"$count": {}}}},
                {"$project": {"_id": 0, "statusView": "$_id", "conteo": 1}},
                {"$sort": {"statusView": 1}},
            ]
        ).to_list()
        conteo_animes = await UTAFavsModel.aggregate(
            [
                {"$match": {"$and": [{"user": ObjectId(user_id)}, {"active": True}]}},
                {"$group": {"_id": "$statusView", "conteo": {"$count": {}}}},
                {"$project": {"_id": 0, "statusView": "$_id", "conteo": 1}},
                {"$sort": {"statusView": 1}},
            ]
        ).to_list()

        return conteo_mangas, conteo_animes

    @staticmethod
    async def get_stats(
        only_Favs: bool = False,
        user: Optional[UserLogRespSchema] = None,
        typeStat: TypeStatisticEnum = TypeStatisticEnum.tipo_a_m,
    ):
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
                ).to_list()
                tiposManga = await MangaModel.aggregate(
                    statsTipo(
                        only_Favs,
                        user.id if user else None,
                        "manga",
                        "utmanfavs",
                        "tipomangas",
                    )
                ).to_list()
            case TypeStatisticEnum.generos:
                porGenero = await GeneroModel.aggregate(
                    statsGenero(only_Favs, user.id if user else None)
                ).to_list()
            case TypeStatisticEnum.studios:
                topStudios = await StudioModel.aggregate(
                    topEstudios(only_Favs, user.id if user else None)
                ).to_list()
            case _:
                topEditorials = await EditorialModel.aggregate(
                    topEditoriales(only_Favs, user.id if user else None)
                ).to_list()
        return tiposAnime, tiposManga, porGenero, topEditorials, topStudios

    @staticmethod
    async def get_conteos_generales():
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
        ).to_list()
        return conteosGenerales
