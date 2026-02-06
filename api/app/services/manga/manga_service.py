from fastapi import HTTPException, status
from typing import Optional
import math

from app.models.manga_model import MangaModel
from app.repositories.manga import MangaRepository
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
from app.core.utils import objects_id_list_to_str
from app.core.logging import get_logger

logger = get_logger(__name__)


class MangaService:
    # Encontrar la lista de animes por pagina de busqueda, solo se obtendran los que estan finalizados
    @staticmethod
    async def get_all(
        filters: FilterSchema, user: Optional[UserLogRespSchema] = None
    ) -> MangaSearchSchema:
        user_id = user.id if user else None
        results, totalMangas = await MangaRepository.find_all_filtered(filters, user_id)

        return MangaSearchSchema(
            listaMangas=[
                MangaModel.to_manga(r, True if user else False, False) for r in results
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
        user_id = user.id if user else None
        manga = await MangaRepository.get_manga_by_key(key_manga, user_id)

        if not manga:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Manga no encontrado",
            )

        return MangaModel.to_manga(manga, True if user else False, True)

    # Obtener los mangas incompletos
    @staticmethod
    async def get_incomplete_mangas(
        filters: FilterSchema, ready_to_mal: ReadyToMALEnum = ReadyToMALEnum.todos
    ) -> SearchMangaIncompleteSchema:
        results, totalMangas = await MangaRepository.find_all_incomplete_filtered(
            filters, ready_to_mal
        )

        results = [MangaModel.to_incomplete_manga(a) for a in results]

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
        editoriales, totalEditoriales = await MangaRepository.get_editorials(filters)
        editoriales = objects_id_list_to_str(editoriales)
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
        autores, totalAutores = await MangaRepository.get_authors(filters)
        autores = objects_id_list_to_str(autores)

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
