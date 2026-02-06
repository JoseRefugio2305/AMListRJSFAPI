from typing import List

from app.models.anime_model import AnimeModel


class AnimeFileRepository:
    @staticmethod
    async def bulk_insert_animes(animes: List[dict]) -> List[str]:
        if not animes:
            return []
        animes=[AnimeModel(**an)for an in animes]
        inserted_animes=await AnimeModel.insert_many(animes)
        return inserted_animes.inserted_ids
