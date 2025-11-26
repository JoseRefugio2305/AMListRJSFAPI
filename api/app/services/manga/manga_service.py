from fastapi import HTTPException, status
from typing import Optional
import math

from .manga_utils import dict_to_manga_schema, dict_to_incomplete_manga
from app.models.manga_model import MangaModel
from app.models.editorial_model import EditorialModel
from app.models.author_model import AuthorModel
from app.schemas.manga import MangaSchema
from app.schemas.common.relations import AutorSchema, EditorialSchema
from app.schemas.search import (
    MangaSearchSchema,
    FilterSchema,
    ReadyToMALEnum,
    SearchMangaIncompleteSchema,
    FilterGSAESchema,
    SearchEditorialsSchema,
    SearchAutoresSchema,
)
from app.schemas.auth import UserLogRespSchema
from app.core.utils import object_id_to_str, objects_id_list_to_str
from app.core.database import (
    lookup_user_favorites,
    filtro_emision,
    filtrado_tipos,
    filtrado_busqueda_avanzada_manga,
    apply_paginacion_ordenacion,
    get_full_manga,
    filtrado_gsae,
)

from app.core.logging import get_logger

logger = get_logger(__name__)


class MangaService:
    # Encontrar la lista de animes por pagina de busqueda, solo se obtendran los que estan finalizados
    @staticmethod
    async def get_all(
        filters: FilterSchema, user: Optional[UserLogRespSchema] = None
    ) -> MangaSearchSchema:
        pipeline = [
            {
                "$match": {"linkMAL": {"$not": {"$eq": None}}},
            },
            *filtrado_tipos(filters.tiposManga, False),
            *filtro_emision(filters.emision, "publicando"),
            *filtrado_busqueda_avanzada_manga(filters),
            *lookup_user_favorites(
                user.id if user else None,
                "manga",
                "utmanfavs",
                filters.onlyFavs,
                filters.statusView,
            ),
        ]

        # Obtenemos el conteo de los animes que concuerdan con la busqueda
        totalMangas = await MangaModel.aggregate([*pipeline, {"$count": "totalMangas"}])

        totalMangas = totalMangas[0]["totalMangas"] if len(totalMangas) > 0 else 0
        # Aplicamos la limitacion a la busqueda
        pipeline.extend(
            apply_paginacion_ordenacion(
                filters.limit, filters.page, filters.orderBy, filters.orderField, False
            )
        )
        results = (
            objects_id_list_to_str(await MangaModel.aggregate(pipeline))
            if totalMangas
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        return MangaSearchSchema(
            listaMangas=[
                dict_to_manga_schema(r, True if user else False, False) for r in results
            ],
            pageM=filters.page,
            totalPagesM=math.ceil(totalMangas / filters.limit),
            totalMangas=totalMangas,
        )

    # Detalles del anime
    @staticmethod
    async def get_manga_by_id(
        key_manga: int, user: Optional[UserLogRespSchema] = None
    ) -> MangaSchema:
        pipeline = [
            {
                "$match": {"key_manga": key_manga},
            },
            *get_full_manga(),
            *lookup_user_favorites(
                user.id if user else None, "manga", "utmanfavs", False, 5
            ),
        ]
        logger.debug(pipeline)
        results = await MangaModel.aggregate(pipeline)

        if len(results) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Manga no encontrado",
            )
        manga = object_id_to_str(
            results[0]
        )  # Agregate retorna por defecto una lista, por lo cual se debe de tomar el primer elemento, si no da resultados, seria un elemento vacio
        return dict_to_manga_schema(manga, True if user else False, True)

    # Obtener los mangas incompletos
    @staticmethod
    async def get_incomplete_mangas(
        filters: FilterSchema, ready_to_mal: ReadyToMALEnum = ReadyToMALEnum.todos
    ) -> SearchMangaIncompleteSchema:
        # Verificamos si quiere solo los listos para actualizarse a mal, es decir, aquellos con un id_MAL ya asignado
        q_r_to_mal = [
            {"linkMAL": {"$eq": None}},
            (
                {"id_MAL": {"$not": {"$eq": None}}}
                if ready_to_mal == ReadyToMALEnum.listo
                else (
                    {"id_MAL": {"$eq": None}}
                    if ready_to_mal == ReadyToMALEnum.no_listo
                    else {}
                )
            ),
        ]

        pipeline = [
            {"$match": {"$and": q_r_to_mal}},
            *filtrado_tipos(filters.tiposManga, False),
            *filtrado_busqueda_avanzada_manga(filters),
        ]
        logger.debug(pipeline)

        # Obtenemos el conteo de los mangas que tienen su informacion incompleta
        totalMangas = await MangaModel.aggregate([*pipeline, {"$count": "totalMangas"}])

        totalMangas = totalMangas[0]["totalMangas"] if len(totalMangas) > 0 else 0
        # Aplicamos la limitacion a la busqueda
        pipeline.extend(
            apply_paginacion_ordenacion(
                filters.limit, filters.page, filters.orderBy, filters.orderField, False
            )
        )
        results = (
            objects_id_list_to_str(await MangaModel.aggregate(pipeline))
            if totalMangas
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        results = [dict_to_incomplete_manga(a) for a in results]

        logger.debug(results)
        return SearchMangaIncompleteSchema(
            listaMangas=results,
            totalMangas=totalMangas,
            totalPages=math.ceil(totalMangas / filters.limit),
            page=filters.page,
        )

    # Busqueda de editoriales de manga
    @staticmethod
    async def editoriales_list(filters: FilterGSAESchema) -> SearchEditorialsSchema:
        pipeline = [filtrado_gsae(filters.txtSearch, True)]
        logger.debug(pipeline)
        editoriales = objects_id_list_to_str(
            await EditorialModel.aggregate(
                [
                    *pipeline,
                    *apply_paginacion_ordenacion(
                        filters.limit,
                        filters.page,
                        filters.orderBy,
                        filters.orderField,
                        False,
                    ),
                ]
            )
        )
        totalEditoriales = await EditorialModel.aggregate(
            [*pipeline, {"$count": "totalEditoriales"}]
        )
        totalEditoriales = (
            totalEditoriales[0]["totalEditoriales"] if len(totalEditoriales) > 0 else 0
        )

        list_Editorials = [
            EditorialSchema(
                nombre=edt.get("nombre"),
                id=edt.get("_id") or edt.get("id") or edt.get("Id"),
                id_MAL=edt.get("id_MAL"),
                linkMAL=edt.get("linkMAL"),
                tipo=edt.get("tipo"),
                fechaAdicion=str(edt.get("fechaAdicion")),
            )
            for edt in editoriales
        ]

        return SearchEditorialsSchema(
            lista=list_Editorials,
            total=totalEditoriales,
            page=filters.page,
            totalPages=math.ceil(totalEditoriales / filters.limit),
        )

    # Busqueda de autores de manga
    @staticmethod
    async def autores_list(filters: FilterGSAESchema) -> SearchAutoresSchema:
        pipeline = [filtrado_gsae(filters.txtSearch, True)]
        logger.debug(pipeline)
        autores = objects_id_list_to_str(
            await AuthorModel.aggregate(
                [
                    *pipeline,
                    *apply_paginacion_ordenacion(
                        filters.limit,
                        filters.page,
                        filters.orderBy,
                        filters.orderField,
                        False,
                    ),
                ]
            )
        )
        totalAutores = await AuthorModel.aggregate(
            [*pipeline, {"$count": "totalAutores"}]
        )
        totalAutores = totalAutores[0]["totalAutores"] if len(totalAutores) > 0 else 0

        list_Autores = [
            AutorSchema(
                nombre=auth.get("nombre"),
                id=auth.get("_id") or auth.get("id") or auth.get("Id"),
                id_MAL=auth.get("id_MAL"),
                linkMAL=auth.get("linkMAL"),
                tipo=auth.get("tipo"),
                fechaAdicion=str(auth.get("fechaAdicion")),
            )
            for auth in autores
        ]

        return SearchAutoresSchema(
            lista=list_Autores,
            total=totalAutores,
            page=filters.page,
            totalPages=math.ceil(totalAutores / filters.limit),
        )
