from pydantic import BaseModel, HttpUrl, AfterValidator
from typing import Optional, Annotated
from app.core.utils import httpurl_to_str


# Imagenes de los animes
class MediaImagesSchema(BaseModel):
    img_sm: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]
    img: Optional[Annotated[HttpUrl, AfterValidator(httpurl_to_str)]] = None
    img_l: Annotated[HttpUrl, AfterValidator(httpurl_to_str)]

