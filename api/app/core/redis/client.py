from redis.asyncio import Redis
from typing import Optional
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)

class RedisClient:
     def __init(self):
          self._client:Optional[Redis]=None
          self._available:bool=False

     async def connect(self):
          if not settings.REDIS_ENABLED:
               logger.info("Redis esta deshabilitado en las configuraciones (modo de desarrollo).")
               return

          try:
               self._client=Redis.from_url(settings.REDIS_URL,encoding="utf-8",decode_responses=True,#para que autodecodificque a string
                                           socket_connect_timeout=5,socket_timeout=5)
               #Verificamos conexion
               await self._client.ping()
               self._available=True
               logger.info(f"Conexión a Redis: {settings.REDIS_HOST}:{settings.REDIS_PORT} establecida correctamente.")

          except Exception as e:
               logger.error(f"No se pudo conectar a Redis: {str(e)}",exc_info=True)
               self._available=False

     async def close_conn(self):
          if self._client:
               await self._client.close()
               logger.info("Conexión a Redis cerrada.")
     
     #Esta disponible?
     @property
     def is_available(self)->bool:
          return self._available
     
     def get_client(self)->Optional[Redis]:
          return self._client if self._available else None
     
redis_client=RedisClient()
