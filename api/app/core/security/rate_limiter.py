from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.security.jwt_handler import verify_access_token


def get_user_id_or_ip(request: Request):
    headerAuth = request.headers.get("Authorization")

    if headerAuth:
        token = headerAuth.split(" ")[1]
        try:
            token_data = verify_access_token(token)
            return f"user:{token_data.sub}"
        except:  # En caso de que el token sea invalido
            pass
    return get_remote_address(request)  # Fallback a IP para anónimos

# Limiter
limiter = Limiter(key_func=get_user_id_or_ip)
