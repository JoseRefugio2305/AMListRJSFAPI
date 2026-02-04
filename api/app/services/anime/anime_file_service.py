from fastapi import UploadFile, HTTPException, status, File
import json

from app.core.logging import get_logger
from app.core.utils import validate_file_animes, time_now_formatted
from app.schemas.anime import AnimeCreateSchema, DictTipoAnime, ResponseUpdAllMALSchema
from app.repositories.anime import AnimeRepository, AnimeFileRepository

logger = get_logger(__name__)


class AnimeFileService:
    # Insertar animes a partir de un archivo sibido
    @staticmethod
    async def insert_from_file(file: UploadFile = File(...)) -> ResponseUpdAllMALSchema:
        content = await file.read()
        # Validamos primero tamano y tipo de archivo
        if not validate_file_animes(file.filename, file.size):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al subir el archivo. El tamaño máximo permitido es de 1 MB y debe ser .json.",
            )
        try:
            # Obtenemos el json del archivo
            json_data = json.loads(content)
            # Si no tiene el objeto data con los animes generamos el error
            if "data" not in json_data:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Error al intentar leer la informacion desde el archivo",
                )

            animes = [
                AnimeCreateSchema(
                    key_anime=anime.get("key"),
                    titulo=anime.get("name"),
                    link_p=anime.get("link"),
                    tipo=DictTipoAnime.get(anime.get("type", "Anime")),
                    fechaAdicion=time_now_formatted(True),
                ).model_dump()
                for anime in json_data.get("data")
            ]

            array_key_anime = [a.get("key_anime") for a in animes]

            # Creamos una lista con los key_anime que ya existen
            key_list = await AnimeRepository.find_keys_in_list(array_key_anime)
            # Filtrado
            animes = [a for a in animes if a.get("key_anime") not in key_list]
            # Insercion de los animes, solo si hay para llevarlo a cabo
            inserted_animes = (
                await AnimeFileRepository.bulk_insert_animes(animes)
                if len(animes) > 0
                else []
            )
            logger.debug(inserted_animes)

            return ResponseUpdAllMALSchema(
                message=f"{len(inserted_animes)} Animes Insertados desde el archivo",
                totalToAct=len(animes),
                totalAct=len(inserted_animes),
            )
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar leer la informacion desde el archivo",
            )
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar insertar la informacion desde el archivo",
            )
