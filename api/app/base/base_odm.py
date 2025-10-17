from typing import Optional

# El siguiente es nuestro ODM base que nos permitira el manejar las consultas a Mongo como si fuesen objetos, y a su vez, nos permitira el realizar consultas haciendo uso de pipelines


class BaseODMModel:
    collection_name: Optional[str] = None

    # Obtnener la coleccion
    @classmethod
    def _collection(cls):
        from app.core.database import db

        if not cls.collection_name:
            raise ValueError(
                "El nombre de la coleccion debe ser definido en la sub clase"
            )
        elif db is None:
            raise RuntimeError("Base de datos no inicializada")
        return db[cls.collection_name]

    # Funciones de consulta y actualizacion
    @classmethod
    async def find_one(cls, filter: dict):
        # Filter sera un diccionario con los filtros de la busqueda
        return await cls._collection().find_one(filter or {})

    @classmethod
    async def find(cls, filter: dict, limit: int = 10):
        cursor = cls._collection().find(filter or {}).limit(limit)

        return await cursor.to_list(length=None)

    @classmethod
    async def insert_one(cls, data: dict):
        inserted = await cls._collection().insert_one(data)
        ##Despues de insertar retornamos solo el _id
        return str(inserted.inserted_id)

    @classmethod
    async def update_one(cls, filter: dict, update: dict, upsert: bool = False):
        # Si se indica la actualizacion puede hacer insert si no existe el doc
        return await cls._collection().update_one(
            filter, {"$set": update}, upsert=upsert
        )

    # Consultas con pipeline
    @classmethod
    async def aggregate(cls, pipeline: list):
        cursor = cls._collection().aggregate(pipeline)
        return await cursor.to_list(length=None)
