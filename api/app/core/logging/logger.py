import logging
from logging.handlers import RotatingFileHandler
import os
from app.core.config import settings

# Directorio de logs, creado en ./app
LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "logs")
os.makedirs(LOG_DIR, exist_ok=True)  # Creamos el directorio si no existe

LOG_FILE = os.path.join(LOG_DIR, "app.log")  # Archivo

# Formato de logs
LOG_FORMAT = "[%(asctime)s] on [%(name)s] Log  with level [%(levelname)s] in [%(module)s]: %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# Definimos el logger
logger = logging.getLogger("animan_api")
logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))

# Handler en consola, para mensajes en desarrollo
consoleHandler = logging.StreamHandler()
consoleHandler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))

# Configuraciones para el archivo de registro, este se rotara cuando llegue a los 5MB y se conservaran 5 copias
fileHandler = RotatingFileHandler(
    LOG_FILE, maxBytes=5 * 1024 * 1024, backupCount=5, encoding="utf-8"
)
fileHandler.setFormatter(logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT))

# Agregamos los loggers
if not logger.hasHandlers():
    logger.addHandler(consoleHandler)
    logger.addHandler(fileHandler)


# Funcion para obtener un sublogger jerarquico del logger principal anime_api
def get_logger(name: str | None = None) -> logging.Logger:
    if not name:  # Si no hay nombre regresamos el principal
        return logger
    return logger.getChild(name)
