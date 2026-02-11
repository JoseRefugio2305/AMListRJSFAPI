from pymongo import AsyncMongoClient
from pymongo.database import Database
from beanie import init_beanie

from app.core.redis.client import redis_client  # Cliente redis
from app.core.config import settings  # Configuraciones de la aplicacion
from app.core.logging import get_logger

logger = get_logger(__name__)

client: AsyncMongoClient | None = None
db: Database | None = None


def get_document_models():
    # La lista de inportaciones se hace aqui para evitar importaciones circulares
    from app.models.anime_model import AnimeModel
    from app.models.manga_model import MangaModel
    from app.models.user_model import UserModel
    from app.models.utafavs_model import UTAFavsModel
    from app.models.utmanfavs_model import UTManFavsModel
    from app.models.genero_model import GeneroModel
    from app.models.studio_model import StudioModel
    from app.models.author_model import AuthorModel
    from app.models.editorial_model import EditorialModel

    return [
        AnimeModel,
        MangaModel,
        UserModel,
        UTAFavsModel,
        UTManFavsModel,
        GeneroModel,
        StudioModel,
        AuthorModel,
        EditorialModel,
    ]


# Conexion con base de datos
async def connect_mongo():
    global client, db

    if client is None:
        try:
            client = AsyncMongoClient(settings.MONGO_URI)
            db = client[settings.MONGO_DB_NAME]

            # Inicializacion de Beanie
            await init_beanie(database=db, document_models=get_document_models())
            logger.info("Beanie inicializado correctamente")

            #Inicializamos conexion redis si esta habilitado
            await redis_client.connect()

            logger.info(
                f"Se realizó la conexión a la base de datos de mongodb: ({settings.MONGO_DB_NAME})",
            )
        except Exception as e:
            logger.error(
                f"Ocurrió un error al intentar establecer la conexión a la base de datos mongodb {settings.MONGO_DB_NAME}: ({str(e)})",
                exc_info=True,
            )
            raise e


# Cerrar conexion
async def close_mongo():
    global client
    if client:
        try:
            await client.close()
            logger.info("Conexión a MongoDB cerrada correctamente")
        except Exception as e:
            logger.warning(
                f"Error al cerrar la conexión MongoDB: {str(e)}", exc_info=True
            )
