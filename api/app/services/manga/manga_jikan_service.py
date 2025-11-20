from fastapi import HTTPException, status
from typing import Optional
from bson.objectid import ObjectId

from app.models.manga_model import MangaModel
from app.schemas.manga import (
    MangaUpdateSchema,
    ResponseUpdCrtManga,
    MangaMALSearch,
)
from app.schemas.anime import (
    PayloadAnimeIDMAL,
    ResponseUpdAllMALSchema,
    RespUpdMALAnimeSchema,
)
from app.schemas.search import (
    PayloadSearchAnimeMAL,
    ResponseSearchMangaMAL,
    TipoContMALEnum,
)
from app.schemas.common.relations import CreateAutorSchema,CreateEditorialSchema
from app.schemas.common.genres import CreateGenreSchema
from app.core.utils import objects_id_list_to_str, ObjectIdStr
from app.core.database import filtrado_info_incompleta
from app.services.jikan_service import JikanService
from .manga_service import MangaService
from app.services.anime import AnimeService

from app.core.logging import get_logger

logger = get_logger(__name__)


class MangaJikanService:

    # Buscar manga en MAL
    @staticmethod
    async def search_manga_mal(
        payload: PayloadSearchAnimeMAL,
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
                image=manga.get("images").get("jpg").get("small_image_url"),
                titulo=manga.get("title"),
                tipo=manga.get("type"),
            )
            for manga in results.get("data")
        ]  # Creamos la lista de los resultados
        return ResponseSearchMangaMAL(
            listaMangas=listaMangas, totalResults=totalResults if totalResults else 0
        )

    # Asignar un idMAL a un manga
    @staticmethod
    async def assign_id_mal_manga(payload: PayloadAnimeIDMAL) -> ResponseUpdCrtManga:
        # Reviamos si existe un manga con el mismo idmal que queremos asignar
        existing_manga = await MangaModel.find_by_idmal(payload.id_MAL)
        if existing_manga:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un manga con el mismo id_MAL",
            )

        # Si no existe un anime con el mismo id mal, asignamos al actual
        try:
            mangaUpd = await MangaModel.update_one(
                {"_id": ObjectId(payload.id)},
                {"$set": {"id_MAL": payload.id_MAL}},
                False,
            )

            return ResponseUpdCrtManga(
                message=f"Manga actualizado al ID MAL {payload.id_MAL} correctamente"
            )
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar actualizar el manga",
            )

    # Actualizar la informacion de un manga desde MAL
    @staticmethod
    async def update_manga_from_mal(
        mangaId: ObjectIdStr,
        id_MAL: Optional[int] = None,
        key_manga: Optional[int] = None,
        is_all: bool = False,
    ) -> RespUpdMALAnimeSchema:
        # Si solo se esta actualizando un manga, entonces primero se revisa si este existe
        if not is_all:
            # Revisamos si existe un manga con el id indicado y que tenga su id_MAL registrado, de no tenerlo no se puede actualizar su informacion
            is_exists = await MangaModel.find_one(
                {"_id": ObjectId(mangaId), "id_MAL": {"$not": {"$eq": None}}}
            )
            logger.debug(is_exists)
            if not is_exists:
                return RespUpdMALAnimeSchema(
                    message="No se encontro el manga a actualizar o no tiene asignado un id_MAL aun",
                    is_success=False,
                )
            id_MAL = is_exists.get(
                "id_MAL"
            )  # Al encontrarlo actualizamos el id mal del manga para lo que sigue
            key_manga = is_exists.get("key_manga")

        try:
            # Buscamos la informacion
            mangaMAL = await JikanService.get_data_manga(id_MAL)
            # Si no se encuentra nada
            if not mangaMAL:
                return RespUpdMALAnimeSchema(
                    message="Error al intentar obtener la informacion del manga desde MAL",
                    is_success=False,
                )

            n_generos = mangaMAL.get("generos")
            n_editoriales = mangaMAL.get("editoriales")
            n_autores = mangaMAL.get("autores")
            # Preparamos la informacion para la actualizacion
            mangaMAL = MangaUpdateSchema.model_validate(mangaMAL)
            mangaMAL.key_manga = key_manga
            mangaUpd = await MangaService.update_manga(
                payload=mangaMAL, manga_id=mangaId
            )
            # Ahora hay que insertar generos, editoriales o autores de manga  nuevos que tenga el manga recien actualizado
            for genero in n_generos:
                rg = await AnimeService.create_genre(
                    CreateGenreSchema(
                        nombre=genero.get("nombre"),
                        id_MAL=genero.get("id_MAL"),
                        nombre_mal=genero.get("nombre"),
                        linkMAL=genero.get("linkMAL"),
                    )
                )
            for editorial in n_editoriales:
                re = await MangaService.create_editorial(
                    CreateEditorialSchema(
                        nombre=editorial.get("nombre"),
                        id_MAL=editorial.get("id_MAL"),
                        linkMAL=editorial.get("linkMAL"),
                        tipo=editorial.get("tipo"),
                    )
                )

            for autor in n_autores:
                ra = await MangaService.create_author(
                    CreateAutorSchema(
                        nombre=editorial.get("nombre"),
                        id_MAL=editorial.get("id_MAL"),
                        linkMAL=editorial.get("linkMAL"),
                        tipo=editorial.get("tipo"),
                    )
                )

            return RespUpdMALAnimeSchema(
                message="Manga Actualizado Correctamente", is_success=True
            )
        except Exception as e:
            logger.debug(str(e))
            return RespUpdMALAnimeSchema(
                message="Ocurrio un error al intentar actualizar la informacion",
                is_success=False,
            )

    # Actualizar todos los mangas sin actualizar a MAL
    @staticmethod
    async def update_all_mangas_from_mal() -> ResponseUpdAllMALSchema:
        try:
            responses = []
            # Obtenemos los mangas que tienen la informacion incompleta pero que ya tienen asigndo un id_mal
            mangas_to_upd = objects_id_list_to_str(
                await MangaModel.aggregate(filtrado_info_incompleta(True))
            )

            for mtu in mangas_to_upd:
                # Actualizamos la informacion
                resp = await MangaJikanService.update_manga_from_mal(
                    mtu.get("_id") or mtu.get("id") or mtu.get("Id"),
                    mtu.get("id_MAL"),
                    mtu.get("key_manga"),
                    True,
                )
                # Agregamos la respuesta
                responses.append(resp)

            success_count = sum(
                1 for r in responses if r.is_success
            )  # Realizamos el conteo de los mangas que se actualizaron correctamente

            return ResponseUpdAllMALSchema(
                message=f"Se llevo a cabo la actualizacion de {success_count} mangas",
                totalToAct=len(responses),
                totalAct=success_count,
            )
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar actualizar los mangas con informacion incompleta",
            )
