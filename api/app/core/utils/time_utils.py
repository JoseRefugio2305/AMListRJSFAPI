from datetime import datetime, timezone


# Funcion para obtener la fecha actual formateada
def time_now_formatted(is_Full: bool = True) -> str:
    now = datetime.now(timezone.utc)

    formatted = (
        now.strftime("%Y-%m-%d %H:%M:%S") if is_Full else now.strftime("%Y-%m-%d")
    )
    return formatted


def datetime_to_str(
    fecha: datetime,
    isFull: bool = True,
) -> str:
    full_format = "%Y-%m-%d %H:%M:%S"
    short_format = "%Y-%m-%d"

    return datetime.strftime(fecha, full_format if isFull else short_format)
