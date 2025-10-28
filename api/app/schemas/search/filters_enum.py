from enum import IntEnum


# Estado de emision/publicacion para filtrado
class EmisionFilterEnum(IntEnum):
    finalizado = 0
    emision = 1  # En los mangas esto seria publicando
    pusado = 2  # En hiatus manga
    todos = 3


# Tipo de contenido Anime/Manga/Todos
class TipoContenidoEnum(IntEnum):
    anime = 1
    manga = 2
    todos = 3
