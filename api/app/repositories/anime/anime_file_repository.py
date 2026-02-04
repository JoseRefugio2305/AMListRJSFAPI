from typing import List

from app.models.anime_model import AnimeModel


class AnimeFileRepository:
    @staticmethod
    async def bulk_insert_animes(animes: List[dict]) -> List[str]:
        if not animes:
            return []
        return await AnimeModel.insert_many(animes)
