from fastapi import HTTPException, status
from typing import Optional
import asyncio

from app.core.tasks.task_manager import task_manager
from app.schemas.common.responses import ResponseUpdCrt, RespUpdMALSchema
from app.schemas.anime import AnimeUpdateSchema, AnimeMALSearch, PayloadAnimeIDMAL
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
from app.repositories.anime import AnimeRepository, AnimeCRUDRepository
from app.repositories.shared import GenreRepository
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
    async def assign_id_mal_anime(payload: PayloadAnimeIDMAL) -> ResponseUpdCrt:
        # Reviamos si existe un anime con el mismo idmal que queremos asignar
        existing_anime = await AnimeRepository.get_by_id_MAL(payload.id_MAL)
        if existing_anime:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un anime con el mismo id_MAL",
            )

        # Si no existe un anime con el mismo id mal, asignamos al actual
        try:
            animeUpd = await AnimeCRUDRepository.update_id_mal(
                payload.id, payload.id_MAL
            )

            return ResponseUpdCrt(
                message=f"Anime actualizado al ID MAL {payload.id_MAL} correctamente"
            )
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar actualizar el anime",
            )

    ##Funcion Wrapper para ejecutar la actualizacion de un anime desde MAL en segundo plano y no pare la ejecutcion
    @staticmethod
    async def run_update_anime_mal_back(task_id: str, animeId: ObjectIdStr):
        try:
            # Iniciamos tarea
            task_manager.start_task(task_id)
            task_manager.update_progress(task_id, 0, 1)
            if task_manager.is_cancelled(task_id):
                logger.info(
                    f"Tarea de actualización de anime con ID {animeId} cancelada: {task_id}"
                )
                return
            try:
                await AnimeJikanService.update_anime_from_mal(
                    animeId=animeId, is_all=False
                )
                task_manager.increment_success(task_id)
            except Exception as e:
                logger.error(
                    f"Error al actualizar anime con id {animeId}: {str(e)}",
                    exc_info=True,
                )
                task_manager.add_error(
                    task_id,
                    f"Error al actualizar anime con id {animeId}: {str(e)}",
                )
            task_manager.update_progress(task_id, 1, 1)
            task_manager.complete_task(
                task_id,
                {
                    "totalAnimes": 1,
                    "totalActualizados": task_manager.get_task(task_id).success_count,
                    "totalErrores": task_manager.get_task(task_id).error_count,
                },
            )
        except Exception as e:
            logger.error(
                f"Error al actualizar anime con id {animeId}: {str(e)}", exc_info=True
            )
            task_manager.fail_task(
                task_id,
                f"Error al intentar actualizar el anime con ID  {animeId}: {str(e)}",
            )

    # Wrapper para ejecutar la actualizacion masiva de animes desde MAL y que esto no afecte a la ejecucion de otras peticiones
    @staticmethod
    async def update_all_animes_from_mal_back(task_id: str):
        try:
            # Iniciamos tarea
            task_manager.start_task(task_id)
            # Obtenemos los animes que tienen la informacion incompleta pero que ya tienen asigndo un id_mal
            animes_to_upd = objects_id_list_to_str(
                await AnimeRepository.get_all_ready_to_mal()
            )
            # Asignamos el total a la tarea
            total_to_upd = len(animes_to_upd)
            task_manager.update_progress(task_id, 0, total_to_upd)
            # procesamos cada anime incompleto
            for idx, anime in enumerate(animes_to_upd, start=1):
                if task_manager.is_cancelled(task_id):
                    logger.info(
                        f"Tarea de actualización masiva de animes cancelada: {task_id}"
                    )
                    return
                try:
                    # Actualizamos informacion
                    await AnimeJikanService.update_anime_from_mal(
                        anime.get("_id") or anime.get("id") or anime.get("Id"),
                        anime.get("id_MAL"),
                        anime.get("key_anime"),
                        True,
                    )
                    task_manager.increment_success(task_id)
                except Exception as e:
                    logger.error(
                        f"Error al actualizar anime con id {anime.get('_id') or anime.get('id') or anime.get('Id')}: {str(e)}",
                        exc_info=True,
                    )
                    task_manager.add_error(
                        task_id,
                        f"Error al actualizar anime con id {anime.get('_id') or anime.get('id') or anime.get('Id')}: {str(e)}",
                    )

                # Actualizamos progreso tarea
                task_manager.update_progress(task_id, idx, total_to_upd)

                await asyncio.sleep(1.1)

            # Completamos tarea
            task_manager.complete_task(
                task_id,
                {
                    "totalAnimes": total_to_upd,
                    "totalActualizados": task_manager.get_task(task_id).success_count,
                    "totalErrores": task_manager.get_task(task_id).error_count,
                },
            )
        except Exception as e:
            task_manager.fail_task(
                task_id,
                f"Error al intentar actualizar los animes con información incompleta: {str(e)}",
            )
            logger.error(
                f"Error al intentar actualizar los animes con información incompleta: {str(e)}",
                exc_info=True,
            )

    # Actualizar un anime sin actualizar con la informacion de MAL
    @staticmethod
    async def update_anime_from_mal(
        animeId: ObjectIdStr,
        id_MAL: Optional[int] = None,
        key_anime: Optional[int] = None,
        is_all: bool = False,
    ) -> RespUpdMALSchema:
        # Si solo se esta actualizando un anime, entonces primero se revisa si este existe
        if not is_all:
            # Revisamos si existe un anime con el id indicado y que tenga su id_MAL registrado, de no tenerlo no se puede actualizar su informacion
            is_exists = await AnimeRepository.get_to_update_mal(animeId)
            if not is_exists:
                return RespUpdMALSchema(
                    message="No se encontro el anime a actualizar o no tiene asignado un id_MAL aun",
                    is_success=False,
                )
            # Al encontrarlo actualizamos el id mal del anime para lo que sigue
            id_MAL = is_exists.id_MAL
            key_anime = is_exists.key_anime

        try:
            # Buscamos la informacion
            animeMAL = await JikanService.get_data_anime(id_MAL)
            logger.debug(animeMAL)
            # Si no se encuentra nada
            if not animeMAL:
                return RespUpdMALSchema(
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
                rg = await GenreRepository.create_genre(
                    CreateGenreSchema(
                        nombre=genero.get("nombre"),
                        id_MAL=genero.get("id_MAL"),
                        nombre_mal=genero.get("nombre"),
                        linkMAL=genero.get("linkMAL"),
                    )
                )
            for studio in n_studios:
                re = await AnimeCRUDRepository.create_studio(
                    CreateStudioSchema(
                        nombre=studio.get("nombre"),
                        id_MAL=studio.get("id_MAL"),
                        linkMAL=studio.get("linkMAL"),
                        fechaAdicion=time_now_formatted(True),
                    )
                )

            return RespUpdMALSchema(
                message=f"Anime con key_anime {key_anime} Actualizado Correctamente",
                is_success=True,
            )
        except Exception as e:
            logger.error(
                str(e),
                exc_info=True,
            )
            return RespUpdMALSchema(
                message=f"Ocurrio un error al intentar actualizar la informacion en el anime con key_anime {key_anime}",
                is_success=False,
            )
