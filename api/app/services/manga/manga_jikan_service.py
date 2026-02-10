from fastapi import HTTPException, status
from typing import Optional
import asyncio

from app.core.tasks.task_manager import task_manager
from app.schemas.common.responses import ResponseUpdCrt, RespUpdMALSchema
from app.schemas.manga import (
    MangaUpdateSchema,
    MangaMALSearch,
    PayloadMangaIDMAL,
)
from app.schemas.search import (
    PayloadSearchMangaMAL,
    ResponseSearchMangaMAL,
    TipoContMALEnum,
)
from app.schemas.common.relations import CreateAutorSchema, CreateEditorialSchema
from app.schemas.common.genres import CreateGenreSchema
from app.core.utils import objects_id_list_to_str, ObjectIdStr
from app.services.jikan_service import JikanService
from .manga_crud_service import MangaCRUDService
from app.repositories.shared import GenreRepository
from app.repositories.manga import MangaCRUDRepository, MangaRepository
from app.core.logging import get_logger

logger = get_logger(__name__)


class MangaJikanService:

    # Buscar manga en MAL
    @staticmethod
    async def search_manga_mal(
        payload: PayloadSearchMangaMAL,
    ) -> ResponseSearchMangaMAL:
        ##Realizamos la busqueda
        results = await JikanService.search_mal(
            payload.tit_search, TipoContMALEnum.manga
        )
        totalResults = (
            results.get("pagination", {}).get("items", {}).get("count")
        )  # Obtenemos el total de los resultados
        listaMangas = [
            MangaMALSearch(
                id_MAL=manga.get("mal_id"),
                linkMAL=manga.get("url"),
                image=manga.get("images").get("jpg").get("image_url"),
                titulo=manga.get("title"),
                tipo=manga.get("type") if manga.get("type") else "Manga",
            )
            for manga in results.get("data")
        ]  # Creamos la lista de los resultados
        return ResponseSearchMangaMAL(
            listaMangas=listaMangas, totalResults=totalResults if totalResults else 0
        )

    # Asignar un idMAL a un manga
    @staticmethod
    async def assign_id_mal_manga(payload: PayloadMangaIDMAL) -> ResponseUpdCrt:
        # Reviamos si existe un manga con el mismo idmal que queremos asignar
        existing_manga = await MangaRepository.get_by_id_MAL(payload.id_MAL)
        if existing_manga:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un manga con el mismo id_MAL",
            )

        # Si no existe un anime con el mismo id mal, asignamos al actual
        try:
            mangaUpd = await MangaCRUDRepository.update_id_mal(
                payload.id, payload.id_MAL
            )

            return ResponseUpdCrt(
                message=f"Manga actualizado al ID MAL {payload.id_MAL} correctamente"
            )
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar actualizar el manga",
            )

    # Wrapper para la ejecucion de la actualizacion del manga desde MAL
    @staticmethod
    async def run_update_manga_mal_back(task_id: str, mangaId: ObjectIdStr):
        try:
            # Iniciamos tarea
            task_manager.start_task(task_id)
            task_manager.update_progress(task_id, 0, 1)
            if task_manager.is_cancelled(task_id):
                logger.info(
                    f"Tarea de actualización de manga con ID {mangaId} cancelada: {task_id}"
                )
                return
            try:
                await MangaJikanService.update_manga_from_mal(
                    mangaId=mangaId, is_all=False
                )
                task_manager.increment_success(task_id)
            except Exception as e:
                logger.error(
                    f"Error al actualizar manga con id {mangaId}: {str(e)}",
                    exc_info=True,
                )
                task_manager.add_error(
                    task_id,
                    f"Error al actualizar manga con id {mangaId}: {str(e)}",
                )
            task_manager.update_progress(task_id, 1, 1)
            task_manager.complete_task(
                task_id,
                {
                    "totalMangas": 1,
                    "totalActualizados": task_manager.get_task(task_id).success_count,
                    "totalErrores": task_manager.get_task(task_id).error_count,
                },
            )
        except Exception as e:
            logger.error(
                f"Error al actualizar manga con id {mangaId}: {str(e)}", exc_info=True
            )
            task_manager.fail_task(
                task_id,
                f"Error al intentar actualizar el manga con ID  {mangaId}: {str(e)}",
            )

    # Wrapper para la ejecucion de la actualizacion masiva de mangas desde MAL
    @staticmethod
    async def update_all_mangas_from_mal_back(task_id: str):
        try:
            # Iniciamos tarea
            task_manager.start_task(task_id)
            # Obtenemos los mangas que tienen la informacion incompleta pero que ya tienen asigndo un id_mal
            mangas_to_upd = objects_id_list_to_str(
                await MangaRepository.get_all_ready_to_mal()
            )
            # Asignamos el total a la tarea
            total_to_upd = len(mangas_to_upd)
            task_manager.update_progress(task_id, 0, total_to_upd)
            # procesamos cada manga incompleto
            for idx, manga in enumerate(mangas_to_upd, start=1):
                if task_manager.is_cancelled(task_id):
                    logger.info(
                        f"Tarea de actualización masiva de mangas cancelada: {task_id}"
                    )
                    return
                try:
                    # Actualizamos informacion
                    await MangaJikanService.update_manga_from_mal(
                        manga.get("_id") or manga.get("id") or manga.get("Id"),
                        manga.get("id_MAL"),
                        manga.get("key_manga"),
                        True,
                    )
                    task_manager.increment_success(task_id)
                except Exception as e:
                    logger.error(
                        f"Error al actualizar manga con id {manga.get('_id') or manga.get('id') or manga.get('Id')}: {str(e)}",
                        exc_info=True,
                    )
                    task_manager.add_error(
                        task_id,
                        f"Error al actualizar manga con id {manga.get('_id') or manga.get('id') or manga.get('Id')}: {str(e)}",
                    )

                # Actualizamos progreso tarea
                task_manager.update_progress(task_id, idx, total_to_upd)

                await asyncio.sleep(1.1)

            # Completamos tarea
            task_manager.complete_task(
                task_id,
                {
                    "totalMangas": total_to_upd,
                    "totalActualizados": task_manager.get_task(task_id).success_count,
                    "totalErrores": task_manager.get_task(task_id).error_count,
                },
            )
        except Exception as e:
            task_manager.fail_task(
                task_id,
                f"Error al intentar actualizar los mangas con información incompleta: {str(e)}",
            )
            logger.error(
                f"Error al intentar actualizar los mangas con información incompleta: {str(e)}",
                exc_info=True,
            )

    # Actualizar la informacion de un manga desde MAL
    @staticmethod
    async def update_manga_from_mal(
        mangaId: ObjectIdStr,
        id_MAL: Optional[int] = None,
        key_manga: Optional[int] = None,
        is_all: bool = False,
    ) -> RespUpdMALSchema:
        # Si solo se esta actualizando un manga, entonces primero se revisa si este existe
        if not is_all:
            # Revisamos si existe un manga con el id indicado y que tenga su id_MAL registrado, de no tenerlo no se puede actualizar su informacion
            is_exists = await MangaRepository.get_to_update_mal(mangaId)
            if not is_exists:
                return RespUpdMALSchema(
                    message="No se encontro el manga a actualizar o no tiene asignado un id_MAL aun",
                    is_success=False,
                )
            logger.debug("Encontre el manga")
            id_MAL = (
                is_exists.id_MAL
            )  # Al encontrarlo actualizamos el id mal del manga para lo que sigue
            key_manga = is_exists.key_manga

        try:
            # Buscamos la informacion
            mangaMAL = await JikanService.get_data_manga(id_MAL)
            logger.debug(mangaMAL)
            # Si no se encuentra nada
            if not mangaMAL:
                return RespUpdMALSchema(
                    message=f"Error al intentar obtener la informacion del manga con id_MAL {id_MAL} desde MAL",
                    is_success=False,
                )

            n_generos = mangaMAL.get("generos")
            n_editoriales = mangaMAL.get("editoriales")
            n_autores = mangaMAL.get("autores")
            # Preparamos la informacion para la actualizacion
            mangaMAL = MangaUpdateSchema.model_validate(mangaMAL)
            mangaMAL.key_manga = key_manga
            mangaUpd = await MangaCRUDService.update_manga(
                payload=mangaMAL, manga_id=mangaId
            )
            # Ahora hay que insertar generos, editoriales o autores de manga  nuevos que tenga el manga recien actualizado
            for genero in n_generos:
                rg = await GenreRepository.create_genre(
                    CreateGenreSchema(
                        nombre=genero.get("nombre"),
                        id_MAL=genero.get("id_MAL"),
                        nombre_mal=genero.get("nombre"),
                        linkMAL=genero.get("linkMAL"),
                    )
                )
            for editorial in n_editoriales:
                re = await MangaCRUDRepository.create_editorial(
                    CreateEditorialSchema(
                        nombre=editorial.get("nombre"),
                        id_MAL=editorial.get("id_MAL"),
                        linkMAL=editorial.get("linkMAL"),
                        tipo=editorial.get("tipo"),
                    )
                )

            for autor in n_autores:
                ra = await MangaCRUDRepository.create_author(
                    CreateAutorSchema(
                        nombre=autor.get("nombre"),
                        id_MAL=autor.get("id_MAL"),
                        linkMAL=autor.get("linkMAL"),
                        tipo=autor.get("tipo"),
                    )
                )

            return RespUpdMALSchema(
                message=f"Manga con key_manga {key_manga} Actualizado Correctamente",
                is_success=True,
            )
        except Exception as e:
            logger.debug(str(e))
            return RespUpdMALSchema(
                message=f"Ocurrio un error al intentar actualizar la informacion del manga con key_manga {key_manga}",
                is_success=False,
            )
