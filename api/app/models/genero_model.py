from beanie import Document
from pydantic import HttpUrl, AfterValidator, BeforeValidator
from typing import Annotated
from pymongo import IndexModel, ASCENDING
from datetime import datetime

from app.core.utils import httpurl_to_str, time_now_formatted, datetime_to_str


def _datetime_to_str_if_needed(v):
    if isinstance(v, datetime):
        return datetime_to_str(v,True)
    return v

class GeneroModel(Document):
    id_MAL: int
    nombre: str
    nombre_mal: str
    linkMAL: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]
    fechaAdicion: Annotated[str, BeforeValidator(_datetime_to_str_if_needed)] = time_now_formatted(
        True
    )

    class Settings:
        name = "generos"
        indexes = [
            IndexModel(
                [("id_MAL", ASCENDING)],
                unique=True,
                partialFilterExpression={"id_MAL": {"$type": "number"}},
                name="id_MAL_genero_idx",
            ),
        ]
