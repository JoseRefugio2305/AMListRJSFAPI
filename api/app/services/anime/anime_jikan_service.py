from fastapi import HTTPException, status
from typing import Optional
from bson.objectid import ObjectId
import asyncio

from app.models.anime_model import AnimeModel
from app.schemas.anime import (
    AnimeUpdateSchema,
    ResponseUpdCrtAnime,
    AnimeMALSearch,
    PayloadAnimeIDMAL,
    RespUpdMALAnimeSchema,
    ResponseUpdAllMALSchema,
)
from app.schemas.common.relations import CreateStudioSchema
from app.schemas.common.genres import CreateGenreSchema
from app.schemas.search import (
    PayloadSearchAnimeMAL,
    ResponseSearchAnimeMAL,
    TipoContMALEnum,
)
from app.core.utils import (
    objects_id_list_to_str,
    time_now_formatted,
    ObjectIdStr,
)
from app.services.jikan_service import JikanService
from .anime_crud_service import AnimeCRUDService
from app.core.database import filtrado_info_incompleta

from app.core.logging import get_logger

logger = get_logger(__name__)


# Clase para funciones del anime relacionadas a jikan
class AnimeJikanService:
    # Lo siguiente seria agregar las funciones de uso de api jikan
    # Buscar un anime en MAL por el titulo
    @staticmethod
    async def search_anime_mal(
        payload: PayloadSearchAnimeMAL,
    ) -> ResponseSearchAnimeMAL:
        ##Realizamos la busqueda
        results = await JikanService.search_mal(
            payload.tit_search, TipoContMALEnum.anime
        )
        totalResults = (
            results.get("pagination", {}).get("items", {}).get("count")
        )  # Obtenemos el total de los resultados
        listAnimes = [
            AnimeMALSearch(
                id_MAL=anime.get("mal_id"),
                linkMAL=anime.get("url"),
                image=anime.get("images").get("jpg").get("image_url"),
                titulo=anime.get("title"),
                tipo=anime.get("type") if anime.get("type") else "Anime",
            )
            for anime in results.get("data")
        ]  # Creamos la lista de los resultados
        return ResponseSearchAnimeMAL(
            listaAnimes=listAnimes, totalResults=totalResults if totalResults else 0
        )

    # Asignar el IDMAL al anime
    @staticmethod
    async def assign_id_mal_anime(payload: PayloadAnimeIDMAL) -> ResponseUpdCrtAnime:
        # Reviamos si existe un anime con el mismo idmal que queremos asignar
        existing_anime = await AnimeModel.find_one({"id_MAL": payload.id_MAL})
        if existing_anime:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un anime con el mismo id_MAL",
            )

        # Si no existe un anime con el mismo id mal, asignamos al actual
        try:
            animeUpd = await AnimeModel.update_one(
                {"_id": ObjectId(payload.id)},
                {"$set": {"id_MAL": payload.id_MAL}},
                False,
            )

            return ResponseUpdCrtAnime(
                message=f"Anime actualizado al ID MAL {payload.id_MAL} correctamente"
            )
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar actualizar el anime",
            )

    ##Funcion Wrapper para ejecutar la actualizacion de un anime desde MAL en segundo plano y no pare la ejecutcion
    @staticmethod
    async def run_update_anime_mal_back(animeId: ObjectIdStr):
        await AnimeJikanService.update_anime_from_mal(animeId=animeId, is_all=False)

    # Wrapper para ejecutar la actualizacion masiva de animes desde MAL y que esto no afecte a la ejecucion de otras peticiones
    @staticmethod
    async def run_update_all_animes_back():
        await AnimeJikanService.update_all_animes_from_mal()

    # Actualizar un anime sin actualizar con la informacion de MAL
    @staticmethod
    async def update_anime_from_mal(
        animeId: ObjectIdStr,
        id_MAL: Optional[int] = None,
        key_anime: Optional[int] = None,
        is_all: bool = False,
    ) -> RespUpdMALAnimeSchema:
        # Si solo se esta actualizando un anime, entonces primero se revisa si este existe
        if not is_all:
            # Revisamos si existe un anime con el id indicado y que tenga su id_MAL registrado, de no tenerlo no se puede actualizar su informacion
            is_exists = await AnimeModel.find_one(
                {"_id": ObjectId(animeId), "id_MAL": {"$not": {"$eq": None}}}
            )
            logger.debug(is_exists)
            if not is_exists:
                return RespUpdMALAnimeSchema(
                    message="No se encontro el anime a actualizar o no tiene asignado un id_MAL aun",
                    is_success=False,
                )
            id_MAL = is_exists.get(
                "id_MAL"
            )  # Al encontrarlo actualizamos el id mal del anime para lo que sigue
            key_anime = is_exists.get("key_anime")

        try:
            # Buscamos la informacion
            animeMAL = await JikanService.get_data_anime(id_MAL)
            # Si no se encuentra nada
            if not animeMAL:
                return RespUpdMALAnimeSchema(
                    message=f"Error al intentar obtener la informacion del anime con id_MAL {id_MAL} desde MAL",
                    is_success=False,
                )

            n_generos = animeMAL.get("generos")
            n_studios = animeMAL.get("studios")
            # Preparamos la informacion para la actualizacion
            animeMAL = AnimeUpdateSchema.model_validate(animeMAL)
            animeMAL.key_anime = key_anime
            animeUpd = await AnimeCRUDService.update_anime(
                payload=animeMAL, anime_id=animeId
            )
            # Ahora hay que insertar generos o estudios de animacion nuevos que tenga el anime recien actualizado
            for genero in n_generos:
                rg = await AnimeCRUDService.create_genre(
                    CreateGenreSchema(
                        nombre=genero.get("nombre"),
                        id_MAL=genero.get("id_MAL"),
                        nombre_mal=genero.get("nombre"),
                        linkMAL=genero.get("linkMAL"),
                    )
                )
            for studio in n_studios:
                re = await AnimeCRUDService.create_studio(
                    CreateStudioSchema(
                        nombre=studio.get("nombre"),
                        id_MAL=studio.get("id_MAL"),
                        linkMAL=studio.get("linkMAL"),
                        fechaAdicion=time_now_formatted(True),
                    )
                )

            return RespUpdMALAnimeSchema(
                message=f"Anime con key_anime {key_anime} Actualizado Correctamente",
                is_success=True,
            )
        except Exception as e:
            logger.debug(str(e))
            return RespUpdMALAnimeSchema(
                message=f"Ocurrio un error al intentar actualizar la informacion en el anime con key_anime {key_anime}",
                is_success=False,
            )

    # Actualizar todos los animes sin actualizar a MAL
    @staticmethod
    async def update_all_animes_from_mal() -> ResponseUpdAllMALSchema:
        try:
            responses = []
            # Obtenemos los animes que tienen la informacion incompleta pero que ya tienen asigndo un id_mal
            animes_to_upd = objects_id_list_to_str(
                await AnimeModel.aggregate(filtrado_info_incompleta(True))
            )

            for atu in animes_to_upd:
                # Actualizamos la informacion
                resp = await AnimeJikanService.update_anime_from_mal(
                    atu.get("_id") or atu.get("id") or atu.get("Id"),
                    atu.get("id_MAL"),
                    atu.get("key_anime"),
                    True,
                )
                # Agregamos la respuesta
                responses.append(resp)
                await asyncio.sleep(1.1)
            logger.debug(responses)
            success_count = sum(
                1 for r in responses if r.is_success
            )  # Realizamos el conteo de los animes que se actualizaron correctamente

            return ResponseUpdAllMALSchema(
                message=f"Se llevo a cabo la actualizacion de {success_count} animes",
                totalToAct=len(responses),
                totalAct=success_count,
            )
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar actualizar los animes con informacion incompleta",
            )
