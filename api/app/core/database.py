from pymongo import AsyncMongoClient
from app.core.config import settings  # Configuraciones de la aplicacion
from app.core.logger import get_logger

logger = get_logger(__name__)

client: AsyncMongoClient | None = None
db = None


# Conexion con base de datos
async def connect_mongo():
    global client, db

    if client is None:
        try:
            client = AsyncMongoClient(settings.MONGO_URI)
            db = client[settings.MONGO_DB_NAME]
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
            client.close()
            logger.info("Conexión a MongoDB cerrada correctamente")
        except Exception as e:
            logger.warning(
                f"Error al cerrar la conexión MongoDB: {str(e)}", exc_info=True
            )
