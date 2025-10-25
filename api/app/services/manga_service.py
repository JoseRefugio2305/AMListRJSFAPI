from fastapi import HTTPException, status
from typing import List, Optional
from bson.objectid import ObjectId


from app.models.manga_model import MangaModel
from app.models.utmanfavs_model import UTManFavsModel
from app.schemas.manga_schema import MangaSchema, MangaFavPayloadSchema
from app.schemas.anime_schema import AniFavRespSchema
from app.schemas.filters_schema import FilterSchema
from app.schemas.auth_schema import UserLogRespSchema
from app.core.utils import object_id_to_str, objects_id_list_to_str, time_now_formatted
from app.core.db_helpers import lookup_user_favorites, filtro_emision, filtrado_tipo

from app.core.logger import get_logger

logger = get_logger(__name__)


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
        fechaAdicion=manga.get("fechaAdicion"),
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
    )


class MangaService:
    # Encontrar la lista de animes por pagina de busqueda, solo se obtendran los que estan finalizados
    @staticmethod
    async def get_all(
        filters: FilterSchema, user: Optional[UserLogRespSchema] = None
    ) -> List[MangaSchema]:
        pipeline = [
            {
                "$match": {"linkMAL": {"$not": {"$eq": None}}},
            },
            *filtrado_tipo(filters.tipoManga, False),
            *filtro_emision(filters.emision, "publicando"),
            *lookup_user_favorites(
                user.id if user else None,
                "manga",
                "utmanfavs",
                filters.onlyFavs,
                filters.statusView,
            ),
            {"$skip": filters.skip},
            {"$limit": filters.limit},
        ]
        results = objects_id_list_to_str(await MangaModel.aggregate(pipeline))

        return [dict_to_manga_schema(r, True if user else False) for r in results]

    # Detalles del anime
    @staticmethod
    async def get_manga_by_id(
        key_manga: int, user: Optional[UserLogRespSchema] = None
    ) -> MangaSchema:
        pipeline = [
            {
                "$match": {"key_manga": key_manga},
            },
            *lookup_user_favorites(
                user.id if user else None, "manga", "utmanfavs", False, 5
            ),
        ]
        results = await MangaModel.aggregate(pipeline)

        if len(results) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Manga no encontrado",
            )
        manga = object_id_to_str(
            results[0]
        )  # Agregate retorna por defecto una lista, por lo cual se debe de tomar el primer elemento, si no da resultados, seria un elemento vacio
        return dict_to_manga_schema(manga, True if user else False)

    # Agregar o quitar de favs y cambiar estatus de manga
    @staticmethod
    async def change_status_favs(
        data: MangaFavPayloadSchema, user: UserLogRespSchema
    ) -> AniFavRespSchema:
        # Antes de actualizar o insertar la relacion se verifica que sea un anime existente
        manga = await MangaModel.find_by_id(ObjectId(data.mangaId))
        if not manga:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Manga no encontrado",
            )
        try:
            nowTS = time_now_formatted(True)
            updated = await UTManFavsModel.update_one(
                {"user": ObjectId(user.id), "manga": ObjectId(data.mangaId)},
                {
                    "manga": ObjectId(data.mangaId),
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
                detail="Error al intentar agregar el manga a favoritos",
            )
