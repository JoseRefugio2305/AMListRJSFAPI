from pydantic_settings import BaseSettings
from pydantic import Field
from pydantic.types import Json
from typing import List, Optional


class Settings(BaseSettings):
    MONGO_URI: str = Field("mongodb://localhost:27017", env="MONGO_URI")
    MONGO_DB_NAME: str = Field("AniMangaNestJS", env="MONGO_DB_NAME")
    JWT_SECRET: str = Field("SECRET_FUERTE", env="JWT_SECRET")
    JWT_ALGORITHM: str = Field("HS256", env="JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        10080, env="ACCESS_TOKEN_EXPIRE_MINUTES"
    )  # 7 dias en minutos
    # Nivel de logs
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")
    # Urls de Origen para CORS
    ORIGINS_CORS: Json[List[str]] = Field(
        ["http://localhost:5173/"], env="ORIGINS_CORS"
    )

    REDIS_ENABLED: bool = Field(
        False, env="REDIS_ENABLED"
    )  # En produccion estara activado
    REDIS_HOST: str = Field("localhost", env="REDIS_HOST")
    REDIS_PORT: int = Field(6379, env="REDIS_PORT")
    REDIS_PASSWORD: Optional[str] = Field(None, env="REDIS_PASSWORD")
    REDIS_DB: int = Field(0, env="REDIS_DB")  # 0 para tareas y 1 para cache

    # Configuracion cache
    CACHE_ENABLED: bool = Field(False, env="CACHE_ENABLED")
    CACHE_TTL_SECONDS: int = Field(300, env="CACHE_TTL_SECONDS")  # 5 minutos default

    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    # Cargamos desde el archivo .env
    class Config:
        env_file = ".env"
        env_file_coding = "utf-8"


settings = Settings()
