from enum import IntEnum

class EstadoEmEnum(IntEnum):
    finalizado = 0
    emision = 1  # Publicando en Manga
    pausado = 2  # En hiatus en manga


class TipoAnimeEnum(IntEnum):
    anime = 1
    ova = 2
    pelicula = 3
    especial = 4
    desconocido = 5
    donghua = 6


class StatusViewEnum(IntEnum):
    viendo = 1  # Leyendo en manga
    pendiente = 2
    considerando = 3
    abandonado = 4
    ninguno = 5