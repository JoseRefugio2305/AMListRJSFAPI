from pydantic import BaseModel


class ResponseUpdCrt(BaseModel):
    message: str


class RespUpdMALSchema(ResponseUpdCrt):
    is_success: bool
