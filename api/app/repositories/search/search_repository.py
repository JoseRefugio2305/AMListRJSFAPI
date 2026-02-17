from app.models.genero_model import GeneroModel
from app.models.studio_model import StudioModel
from app.models.author_model import AuthorModel
from app.models.editorial_model import EditorialModel
from app.core.cache.decorators import gen_cached
from app.core.cache.cache_manager import cache_manager


class SearchRepository:
    @staticmethod
    @gen_cached(prefix=f"{cache_manager.FILTERS_PREFIX}generos", ttl=3600)
    async def get_generos():
        return await GeneroModel.find_many().to_list()

    @staticmethod
    @gen_cached(prefix=f"{cache_manager.FILTERS_PREFIX}studios", ttl=3600)
    async def get_studios():
        return await StudioModel.find_many().to_list()

    @staticmethod
    @gen_cached(prefix=f"{cache_manager.FILTERS_PREFIX}editoriales", ttl=3600)
    async def get_editoriales():
        return await EditorialModel.find_many().to_list()

    @staticmethod
    @gen_cached(prefix=f"{cache_manager.FILTERS_PREFIX}autores", ttl=3600)
    async def get_autores():
        return await AuthorModel.find_many().to_list()

    @staticmethod
    async def get_filers():
        lista_generos = await SearchRepository.get_generos()
        lista_studios = await SearchRepository.get_studios()
        lista_editoriales = await SearchRepository.get_editoriales()
        lista_autores = await SearchRepository.get_autores()

        return lista_generos, lista_studios, lista_editoriales, lista_autores
