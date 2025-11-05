from fastapi import HTTPException, status
from typing import Optional
from bson.objectid import ObjectId
import math

from app.models.anime_model import AnimeModel
from app.models.utafavs_model import UTAFavsModel
from app.schemas.anime import AnimeSchema, AniFavPayloadSchema, AniFavRespSchema
from app.schemas.search import AnimeSearchSchema, FilterSchema
from app.schemas.auth import UserLogRespSchema
from app.core.utils import object_id_to_str, objects_id_list_to_str, time_now_formatted
from app.core.database import (
    lookup_user_favorites,
    filtro_emision,
    filtrado_tipos,
    filtrado_busqueda_avanzada_anime,
)

from app.core.logging import get_logger

logger = get_logger(__name__)


##Convertir el dict de bdd a un schema de ANimeSchema
def dict_to_anime_schema(anime: dict, is_User: bool = False) -> AnimeSchema:
    return AnimeSchema(
        id=anime.get("_id") or anime.get("id") or anime.get("Id"),
        key_anime=anime.get("key_anime"),
        titulo=anime.get("titulo"),
        link_p=anime.get("link_p"),
        tipo=anime.get("tipo"),
        animeImages=anime.get("animeImages"),
        calificacion=anime.get("calificacion"),
        descripcion=anime.get("descripcion"),
        emision=anime.get("emision"),
        episodios=anime.get("episodios") if anime.get("episodios") else 0,
        fechaAdicion=str(anime.get("fechaAdicion")),
        fechaEmision=str(anime.get("fechaEmision")),
        generos=anime.get("generos"),
        id_MAL=anime.get("id_MAL"),
        linkMAL=anime.get("linkMAL"),
        numRatings=anime.get("numRatings"),
        relaciones=anime.get("relaciones"),
        studios=anime.get("studios"),
        titulos_alt=anime.get("titulos_alt"),
        isFav=anime.get("is_fav") if is_User else False,
        statusView=anime.get("statusView") if is_User else None,
    )


class AnimeService:

    # Encontrar la lista de animes por pagina de busqueda, solo se obtendran los que estan finalizados
    @staticmethod
    async def get_all(
        filters: FilterSchema, user: Optional[UserLogRespSchema] = None
    ) -> AnimeSearchSchema:
        logger.debug(filters)
        pipeline = [
            {
                "$match": {"linkMAL": {"$not": {"$eq": None}}},
            },
            *filtrado_tipos(filters.tiposAnime, True),
            *filtro_emision(filters.emision, "emision"),
            *filtrado_busqueda_avanzada_anime(filters),
            *lookup_user_favorites(
                user.id if user else None,
                "anime",
                "utafavs",
                filters.onlyFavs,
                filters.statusView,
            ),
        ]
        logger.debug(pipeline)
        # Obtenemos el conteo de los animes que concuerdan con la busqueda
        totalAnimes = await AnimeModel.aggregate([*pipeline, {"$count": "totalAnimes"}])

        totalAnimes = totalAnimes[0]["totalAnimes"] if len(totalAnimes) > 0 else 0
        # Aplicamos la limitacion a la busqueda
        pipeline.append({"$skip": (filters.page - 1) * filters.limit})
        pipeline.append({"$limit": filters.limit})
        results = (
            objects_id_list_to_str(await AnimeModel.aggregate(pipeline))
            if totalAnimes
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        return AnimeSearchSchema(
            listaAnimes=[
                dict_to_anime_schema(r, True if user else False) for r in results
            ],
            page=filters.page,
            totalPages=math.ceil(totalAnimes / filters.limit),
            totalAnimes=totalAnimes,
        )

    # Detalles del anime
    @staticmethod
    async def get_anime_by_id(
        key_anime: int, user: Optional[UserLogRespSchema] = None
    ) -> AnimeSchema:
        pipeline = [
            {
                "$match": {"key_anime": key_anime},
            },
            *lookup_user_favorites(
                user.id if user else None, "anime", "utafavs", False, 5
            ),
        ]
        results = await AnimeModel.aggregate(pipeline)

        if len(results) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Anime no encontrado",
            )
        anime = object_id_to_str(
            results[0]
        )  # Agregate retorna por defecto una lista, por lo cual se debe de tomar el primer elemento, si no da resultados, seria un elemento vacio
        return dict_to_anime_schema(anime, True if user else False)

    # Agregar o quitar de favs y cambiar estatus de anime
    @staticmethod
    async def change_status_favs(
        data: AniFavPayloadSchema, user: UserLogRespSchema
    ) -> AniFavRespSchema:
        # Antes de actualizar o insertar la relacion se verifica que sea un anime existente
        anime = await AnimeModel.find_by_id(ObjectId(data.animeId))
        if not anime:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Anime no encontrado",
            )
        try:
            nowTS = time_now_formatted(True)
            updated = await UTAFavsModel.update_one(
                {"user": ObjectId(user.id), "anime": ObjectId(data.animeId)},
                {
                    "anime": ObjectId(data.animeId),
                    "user": ObjectId(user.id),
                    "active": data.active,
                    "statusView": data.statusView,
                    "fechaAdicion": nowTS,
                },
                upsert=True,
            )  # Actualizamos el registro o insertamos en caso de que no exista la relacion

            return AniFavRespSchema(active=data.active, statusView=data.statusView)
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar agregar el anime a favoritos",
            )
