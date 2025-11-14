from enum import IntEnum


# Estado de emision/publicacion para filtrado
class EmisionFilterEnum(IntEnum):
    finalizado = 0
    emision = 1  # En los mangas esto seria publicando
    pusado = 2  # En hiatus manga
    todos = 3


# Tipo de contenido Anime/Manga para la busqueda en MAL
class TipoContMALEnum(IntEnum):
    anime = 1
    manga = 2


# Tipo de contenido Anime/Manga/Todos, para la busqueda en el sistema
class TipoContenidoEnum(IntEnum):
    anime = 1
    manga = 2
    todos = 3


class ActiveUserEnum(IntEnum):
    inactivo = 0
    activo = 1
    todos = 2


# Enum para filtrar anime o manga que esta listo o no para ser actualizado a MAL
class ReadyToMALEnum(IntEnum):
    no_listo = 0
    listo = 1
    todos = 2  # Se refiere a traer ambos
