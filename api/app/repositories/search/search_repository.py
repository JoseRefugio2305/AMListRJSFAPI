from app.models.genero_model import GeneroModel
from app.models.studio_model import StudioModel
from app.models.author_model import AuthorModel
from app.models.editorial_model import EditorialModel


class SearchRepository:
    @staticmethod
    async def get_filers():
        lista_generos = await GeneroModel.find({})
        lista_studios = await StudioModel.find({})
        lista_editoriales = await EditorialModel.find({})
        lista_autores = await AuthorModel.find({})

        return lista_generos, lista_studios, lista_editoriales, lista_autores
