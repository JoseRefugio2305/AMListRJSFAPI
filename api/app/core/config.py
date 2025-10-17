from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    MONGO_URI: str = Field("mongodb://localhost:27017", env="MONGO_URI")
    MONGO_DB_NAME: str = Field("AniMangaNestJS", env="MONGO_DB_NAME")
    JWT_SECRET: str = Field("SECRET_FUERTE", env="JWT_SECRET")
    JWT_ALGORITHM: str = Field("HS256", env="JWT_ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        10080, env="ACCESS_TOKEN_EXPIRE_MINUTES"
    )  # 7 dias en minutos
    #Nivel de logs
    LOG_LEVEL:str=Field("INFO", env="LOG_LEVEL")

    # Cargamos desde el archivo .env
    class Config:
        env_file = ".env"
        env_file_coding = "utf-8"


settings = Settings()
