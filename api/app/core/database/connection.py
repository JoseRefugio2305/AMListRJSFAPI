from pymongo import AsyncMongoClient
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError
from app.core.config import settings  # Configuraciones de la aplicacion
from app.core.logging import get_logger

logger = get_logger(__name__)

client: AsyncMongoClient | None = None
db: Database | None = None


# Conexion con base de datos
async def connect_mongo():
    global client, db

    if client is None:
        try:
            client = AsyncMongoClient(settings.MONGO_URI)
            db = client[settings.MONGO_DB_NAME]
            await ensure_indexes(db)
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


# Creacion de indices
async def ensure_indexes(db: Database):
    indexes = [
        (db.animes, [("key_anime", 1)], {"unique": True, "background": True}),
        (db.mangas, [("key_manga", 1)], {"unique": True, "background": True}),
        (
            db.animes,
            [("id_MAL", 1)],
            {"unique": True, "sparse": True, "background": True},
        ),
        (
            db.mangas,
            [("id_MAL", 1)],
            {"unique": True, "sparse": True, "background": True},
        ),
        (
            db.generos,
            [("id_MAL", 1)],
            {"unique": True, "sparse": True, "background": True},
        ),
        (
            db.autors,
            [("id_MAL", 1)],
            {"unique": True, "sparse": True, "background": True},
        ),
        (
            db.editorials,
            [("id_MAL", 1)],
            {"unique": True, "sparse": True, "background": True},
        ),
        (
            db.studios,
            [("id_MAL", 1)],
            {"unique": True, "sparse": True, "background": True},
        ),
        (db.users, [("email", 1)], {"unique": True, "background": True}),
        (db.users, [("name", 1)], {"unique": True, "background": True}),
        (db.utafavs, [("anime", 1), ("user", 1)], {"background": True}),
        (db.utmanfavs, [("manga", 1), ("user", 1)], {"background": True}),
    ]
    # Recorremos cada indice para ejecutar su creacion y procesar si hay algun error
    for collection, index_spec, index_opts in indexes:
        try:
            await collection.create_index(index_spec, **index_opts)
        except DuplicateKeyError:
            # indice ya existe, continuar sin error
            pass
        except Exception as e:
            # Otros errores se registran pero no impiden el inicio
            logger.warning(
                f"Error al crear índice {index_spec} en {collection.name}: {str(e)}"
            )
