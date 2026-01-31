from enum import IntEnum, StrEnum
from app.schemas.auth import RolEnum


# Estado de emision/publicacion para filtrado
class EmisionFilterEnum(IntEnum):
    finalizado = 0
    emision = 1  # En los mangas esto seria publicando
    pausado = 2  # En hiatus manga
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


# Enum de campos por los cuales se puede hacer ordenamiento en anime y manga
class FieldOrdEnum(StrEnum):
    key = "key"
    id_mal = "id_MAL"
    titulo = "titulo"
    calificacion = "calificacion"
    episodios = "episodios"
    capitulos = "capitulos"


# Enum de ordenacion
class OrderByEnum(IntEnum):
    asc = 1
    desc = -1


# Enum de campos por los cuales se ordenaran las consultas de usuarios
class FieldOrdUsersEnum(StrEnum):
    name = "name"
    email = "email"


# Enum de tipos de usuarios para el filtrado
class UserTypeEnum(IntEnum):
    base_user = RolEnum.base_user
    admin = RolEnum.admin
    todos = 2


# Enum de campos por los que se puede ordenar la consulta de generos, estudios de animacion, editoriales y autores
class FieldOrdGSAEEnum(StrEnum):
    nombre = "nombre"
    nombre_mal = "nombre_mal"
    fechaAdicion = "fechaAdicion"
    id_MAL = "id_MAL"
    tipo = "tipo"
