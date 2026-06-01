from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    PORT: int = Field(8000, env="PORT")

    cors_allow_origins: List[str] = [
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "http://localhost:3000",
    ]

    class Config:
        env_file = ".env"


settings = Settings()