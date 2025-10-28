from datetime import datetime, timezone

# Funcion para obtener la fecha actual formateada
def time_now_formatted(is_Full: bool = True) -> str:
    now = datetime.now(timezone.utc)

    formatted = (
        now.strftime("%Y-%m-%d %H:%M:%S") if is_Full else now.strftime("%Y-%m-%d")
    )
    return formatted
