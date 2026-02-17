from functools import wraps
import inspect
from typing import Callable, Optional

from .cache_manager import cache_manager
from app.core.logging import get_logger
from app.schemas.stats import TypeStatisticEnum

logger = get_logger(__name__)


def gen_cached(
    prefix: str, ttl: Optional[int] = None, key_builder: Optional[Callable] = None
):
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            logger.debug(
                f"Intentando obtener cache para {func.__name__} con args: {args} y kwargs: {kwargs}"
            )
            if (
                key_builder
            ):  # Si no hay función para generar la key se usa la que está por defecto en el cache manager
                cache_key = key_builder(*args, **kwargs)
            else:
                cache_key = cache_manager._generate_key(prefix, *args, **kwargs)
            cached_result = await cache_manager.get(cache_key)

            if cached_result is not None:  # Si hay cache
                logger.debug(
                    f"Cache HIT Decorator para {func.__name__} con clave: {cache_key}"
                )
                return cached_result

            # Si no hay cache
            logger.debug(f"Cache MISS para {func.__name__} con clave: {cache_key}")
            result = await func(*args, **kwargs)

            # Guardamos en cache
            if result is not None:
                await cache_manager.set(cache_key, result, ttl=ttl)

            return result

        return wrapper

    return decorator


def cached_stats(prefix: str, ttl: Optional[int] = None):
    def decorator(func: Callable):
        sig = inspect.signature(func)
        param_names = list(sig.parameters.keys())

        @wraps(func)
        async def wrapper(*args, **kwargs):
            bound_args = sig.bind_partial(*args, **kwargs)
            bound_args.apply_defaults()
            params_dict = bound_args.arguments

            # Ahora puedo obtener user de forma segura
            user = params_dict.get("user")
            if user and hasattr(user, "id"):
                user_id = user.id
            else:
                user_id = params_dict.get("user_id", "global")

            prefix_with_user = cache_manager.STATS_PREFIX + f"{user_id}:{prefix}"

            type_stat = params_dict.get("typeStat")
            if type_stat and isinstance(type_stat, TypeStatisticEnum):
                prefix_with_user += f":{type_stat.value}"

            cached_result = await cache_manager.get(prefix_with_user)

            logger.debug(
                f"Intentando obtener cache para {func.__name__} con user_id: {user_id} y args: {args} y kwargs: {kwargs} params dict: {params_dict} boynd_args: {bound_args}"
            )
            if cached_result is not None:
                logger.debug(
                    f"Cache HIT Decorator para {func.__name__} con user_id: {user_id} y prefix: {prefix_with_user}"
                )
                return cached_result

            # Si no hay cache
            logger.debug(
                f"Cache MISS para {func.__name__} con user_id: {user_id} y prefix: {prefix_with_user}"
            )
            result = await func(*args, **kwargs)

            # Guardamos en cache
            if result is not None:
                await cache_manager.set(
                    prefix_with_user, result, ttl=ttl or cache_manager.TTL_STATS
                )

            return result

        return wrapper

    return decorator
