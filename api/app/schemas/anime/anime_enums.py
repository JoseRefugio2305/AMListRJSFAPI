from enum import IntEnum, StrEnum


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


# Enum para los tipos de anime en string
DictTipoAnime = {
    "Anime": TipoAnimeEnum.anime,
    "OVA": TipoAnimeEnum.ova,
    "Especial": TipoAnimeEnum.especial,
    "Película": TipoAnimeEnum.pelicula,
    "Desconocido": TipoAnimeEnum.desconocido,
    "Donghua": TipoAnimeEnum.donghua,
}


class StatusViewEnum(IntEnum):
    viendo = 1  # Leyendo en manga
    pendiente = 2
    considerando = 3
    abandonado = 4
    ninguno = 5
    completado = 6
