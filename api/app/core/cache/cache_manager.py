from typing import Optional, Any, List
import json
import hashlib
import pickle
import base64

from app.core.redis.client import redis_client
from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class CacheManager:
    def __init__(self):
        self.ANIME_PREFIX = "cahce:anime:"
        self.MANGA_PREFIX = "cache:manga:"
        self.USER_PREFIX = "cache:user:"
        self.SEARCH_PREFIX = "cache:search:"
        self.FILTERS_PREFIX = "cache:filters:"
        self.STATS_PREFIX = "cache:stats:"

        # TTLs por segundos
        self.TTL_ANIME = 300
        self.TTL_MANGA = 300
        self.TTL_USER = 180
        self.TTL_SEARCH = 600
        self.TTL_FILTERS = 3600
        self.TTL_STATS = 900

        # metricas
        self.hits = 0
        self.misses = 0

    def _generate_key(self, prefix: str, *args, **kwargs) -> str:
        args_srt = json.dumps(
            {"args": args, "kwargs": sorted(kwargs.items())}, sort_keys=True
        )  # Se ordenan por la key, para que no importe en que orden se pasen los kwargs, siempre se genere la misma clave
        args_hash = hashlib.md5(args_srt.encode()).hexdigest()[:16]

        return f"{prefix}{args_hash}"

    async def get(self, key: str) -> Optional[Any]:
        if not settings.CACHE_ENABLED or not redis_client.is_available:
            return None

        try:
            redis = redis_client.get_client()
            if not redis:
                return None

            value = await redis.get(key)

            if value:
                self.hits += 1
                logger.debug(f"Cache HIT para clave: {key}")
                try:
                    # Deserializar usando pickle (preserva tipos de objetos)
                    decoded_value = base64.b64decode(value)
                    return pickle.loads(decoded_value)
                except (pickle.UnpicklingError, ValueError, TypeError) as e:
                    logger.error(
                        f"Error al deserializar cache para clave {key}: {str(e)}"
                    )
                    return None
            else:
                self.misses += 1
                logger.debug(f"Cache MISS para clave: {key}")
                return None
        except Exception as e:
            logger.error(f"Error al obtener del cache: {str(e)}", exc_info=True)
            return None

    async def set(self, key: str, value: Any, ttl: int = None):
        if not settings.CACHE_ENABLED or not redis_client.is_available:
            return

        try:
            redis = redis_client.get_client()
            if not redis:
                return

            ttl = ttl or settings.CACHE_TTL_SECONDS

            # Serializar usando pickle (preserva tipos de objetos)
            pickled_value = pickle.dumps(value)
            encoded_value = base64.b64encode(pickled_value).decode("utf-8")

            await redis.setex(key, ttl, encoded_value)
            logger.debug(f"Valor cacheado para clave: {key} con TTL: {ttl} segundos")
        except Exception as e:
            logger.error(f"Error al establecer en cache: {str(e)}", exc_info=True)

    async def delete(self, key: str):
        if not settings.CACHE_ENABLED or not redis_client.is_available:
            return

        try:
            redis = redis_client.get_client()
            if redis:
                await redis.delete(key)
                logger.debug(f"Clave eliminada del cache: {key}")

        except Exception as e:
            logger.error(f"Error al eliminar del cache: {str(e)}", exc_info=True)

    async def delete_pattern(self, pattern: str):
        if not settings.CACHE_ENABLED or not redis_client.is_available:
            return

        try:
            redis = redis_client.get_client()
            if not redis:
                return

            deleted = 0

            async for key in redis.scan_iter(match=pattern):
                await redis.delete(key)
                deleted += 1

            if deleted > 0:
                logger.info(
                    f"Cache eliminado por patrón: {pattern}, claves eliminadas: {deleted}"
                )
        except Exception as e:
            logger.error(
                f"Error al eliminar por patrón {pattern}: {str(e)}", exc_info=True
            )

    async def clear_All(self):
        if not settings.CACHE_ENABLED or not redis_client.is_available:
            return

        try:
            redis = redis_client.get_client()
            if redis:
                await redis.flushdb()
                logger.info("Cache completamente limpiado")
        except Exception as e:
            logger.error(f"Error al limpiar el cache: {str(e)}", exc_info=True)

    async def get_stats_cache(
        self,
    ) -> dict:
        total = self.hits + self.misses
        hit_rate = (self.hits / total * 100) if total > 0 else 0
        return {
            "hits": self.hits,
            "misses": self.misses,
            "total": total,
            "hit_rate_porcentaje": round(hit_rate, 2),
            "enabled": settings.CACHE_ENABLED,
            "redis_available": redis_client.is_available,
        }

    async def get_anime(
        self, key_anime: int, user_id: Optional[str] = None
    ) -> Optional[dict]:
        cache_key = self._generate_key(
            self.ANIME_PREFIX, key_anime=key_anime, user_id=user_id
        )

        return await self.get(cache_key)

    async def set_anime(
        self, key_anime: int, data: dict, user_id: Optional[str] = None
    ):
        cache_key = self._generate_key(
            self.ANIME_PREFIX, key_anime=key_anime, user_id=user_id
        )

        await self.set(cache_key, data, self.TTL_ANIME)

    async def invalidate_anime(self, key_anime: int):
        pattern = f"{self.ANIME_PREFIX}*key_anime={key_anime}*"
        await self.delete_pattern(pattern)

    async def get_manga(
        self, key_manga: int, user_id: Optional[str] = None
    ) -> Optional[dict]:
        cache_key = self._generate_key(
            self.MANGA_PREFIX, key_manga=key_manga, user_id=user_id
        )

        return await self.get(cache_key)

    async def set_manga(
        self, key_manga: int, data: dict, user_id: Optional[str] = None
    ):
        cache_key = self._generate_key(
            self.MANGA_PREFIX, key_manga=key_manga, user_id=user_id
        )

        await self.set(cache_key, data, self.TTL_MANGA)

    async def invalidate_manga(self, key_manga: int):
        pattern = f"{self.MANGA_PREFIX}*key_manga={key_manga}*"
        await self.delete_pattern(pattern)

    async def get_search(
        self,
        filters: dict,
        page: int,
        limit: int,
        is_anime_search: bool,
        user_id: Optional[str] = None,
    ) -> Optional[dict]:
        cache_key = self._generate_key(
            self,
            (
                self.SEARCH_PREFIX + f"_user_{user_id}:"
                if user_id
                else self.SEARCH_PREFIX
            ),  # Si es la busqueda de un usuario se le agrega un prefijo para que no se mezcle con las busquedas anonimas y asi invalidar solo las busquedas de ese usuario cuando se actualice su informacion de favoritos
            filters=filters,
            page=page,
            limit=limit,
            is_anime_search=is_anime_search,
            user_id=user_id,
        )

        return await self.get(cache_key)

    async def set_search(
        self,
        filters: dict,
        page: int,
        limit: int,
        data: dict,
        is_anime_search: bool,
        user_id: Optional[str] = None,
    ):
        cache_key = self._generate_key(
            self,
            (
                self.SEARCH_PREFIX + f"_user_{user_id}:"
                if user_id
                else self.SEARCH_PREFIX
            ),  # Si es la busqueda de un usuario se le agrega un prefijo para que no se mezcle con las busquedas anonimas y asi invalidar solo las busquedas de ese usuario cuando se actualice su informacion de favoritos
            filters=filters,
            page=page,
            limit=limit,
            is_anime_search=is_anime_search,
            user_id=user_id,
        )
        await self.set(cache_key, data, self.TTL_SEARCH)

    async def invalidate_search(self):
        await self.delete_pattern(f"{self.SEARCH_PREFIX}*")

    async def get_filters(self, content_type: str) -> Optional[List[dict]]:
        cache_key = f"{self.FILTERS_PREFIX}{content_type}"

        return await self.get(cache_key)

    async def set_filters(self, content_type: str, data: List[dict]):
        cache_key = f"{self.FILTERS_PREFIX}{content_type}"
        await self.set(cache_key, data, self.TTL_FILTERS)

    async def invalidate_filters(self):
        await self.delete_pattern(f"{self.FILTERS_PREFIX}*")


cache_manager = CacheManager()
