from fastapi import HTTPException, status
from typing import Optional
from bson.objectid import ObjectId
import math

from app.models.anime_model import AnimeModel
from app.models.genero_model import GeneroModel
from app.models.studio_model import StudioModel
from app.models.utafavs_model import UTAFavsModel
from app.schemas.anime import (
    AnimeSchema,
    AniFavPayloadSchema,
    AniFavRespSchema,
    AnimeCreateSchema,
    AnimeUpdateSchema,
    ResponseUpdCrtAnime,
    AnimeMALSearch,
    PayloadAnimeIDMAL,
    RespUpdMALAnimeSchema,
    CreateGenreSchema,
    CreateStudioSchema,
    ResponseUpdAllMALSchema,
)
from app.schemas.search import (
    AnimeSearchSchema,
    FilterSchema,
    PayloadSearchAnimeMAL,
    ResponseSearchAnimeMAL,
    TipoContMALEnum,
)
from app.schemas.auth import UserLogRespSchema
from app.core.utils import (
    object_id_to_str,
    objects_id_list_to_str,
    time_now_formatted,
    ObjectIdStr,
)
from .jikan_service import JikanService
from app.core.database import (
    lookup_user_favorites,
    filtro_emision,
    filtrado_tipos,
    filtrado_busqueda_avanzada_anime,
    filtrado_info_incompleta,
)

from app.core.logging import get_logger

logger = get_logger(__name__)


##Convertir el dict de bdd a un schema de ANimeSchema
def dict_to_anime_schema(anime: dict, is_User: bool = False) -> AnimeSchema:
    return AnimeSchema(
        id=anime.get("_id") or anime.get("id") or anime.get("Id"),
        key_anime=anime.get("key_anime"),
        titulo=anime.get("titulo"),
        link_p=anime.get("link_p"),
        tipo=anime.get("tipo"),
        animeImages=anime.get("animeImages"),
        calificacion=anime.get("calificacion"),
        descripcion=anime.get("descripcion"),
        emision=anime.get("emision"),
        episodios=anime.get("episodios") if anime.get("episodios") else 0,
        fechaAdicion=str(anime.get("fechaAdicion")),
        fechaEmision=str(anime.get("fechaEmision")),
        generos=anime.get("generos"),
        id_MAL=anime.get("id_MAL"),
        linkMAL=anime.get("linkMAL"),
        numRatings=anime.get("numRatings"),
        relaciones=anime.get("relaciones"),
        studios=anime.get("studios"),
        titulos_alt=anime.get("titulos_alt"),
        isFav=anime.get("is_fav") if is_User else False,
        statusView=anime.get("statusView") if is_User else None,
    )


class AnimeService:

    # Encontrar la lista de animes por pagina de busqueda, solo se obtendran los que estan finalizados
    @staticmethod
    async def get_all(
        filters: FilterSchema, user: Optional[UserLogRespSchema] = None
    ) -> AnimeSearchSchema:
        logger.debug(filters)
        pipeline = [
            {
                "$match": {"linkMAL": {"$not": {"$eq": None}}},
            },
            *filtrado_tipos(filters.tiposAnime, True),
            *filtro_emision(filters.emision, "emision"),
            *filtrado_busqueda_avanzada_anime(filters),
            *lookup_user_favorites(
                user.id if user else None,
                "anime",
                "utafavs",
                filters.onlyFavs,
                filters.statusView,
            ),
        ]
        logger.debug(pipeline)
        # Obtenemos el conteo de los animes que concuerdan con la busqueda
        totalAnimes = await AnimeModel.aggregate([*pipeline, {"$count": "totalAnimes"}])

        totalAnimes = totalAnimes[0]["totalAnimes"] if len(totalAnimes) > 0 else 0
        # Aplicamos la limitacion a la busqueda
        pipeline.append({"$skip": (filters.page - 1) * filters.limit})
        pipeline.append({"$limit": filters.limit})
        results = (
            objects_id_list_to_str(await AnimeModel.aggregate(pipeline))
            if totalAnimes
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        return AnimeSearchSchema(
            listaAnimes=[
                dict_to_anime_schema(r, True if user else False) for r in results
            ],
            pageA=filters.page,
            totalPagesA=math.ceil(totalAnimes / filters.limit),
            totalAnimes=totalAnimes,
        )

    # Detalles del anime
    @staticmethod
    async def get_anime_by_id(
        key_anime: int, user: Optional[UserLogRespSchema] = None
    ) -> AnimeSchema:
        pipeline = [
            {
                "$match": {"key_anime": key_anime},
            },
            *lookup_user_favorites(
                user.id if user else None, "anime", "utafavs", False, 5
            ),
        ]
        results = await AnimeModel.aggregate(pipeline)

        if len(results) == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Anime no encontrado",
            )
        anime = object_id_to_str(
            results[0]
        )  # Agregate retorna por defecto una lista, por lo cual se debe de tomar el primer elemento, si no da resultados, seria un elemento vacio
        return dict_to_anime_schema(anime, True if user else False)

    # Agregar o quitar de favs y cambiar estatus de anime
    @staticmethod
    async def change_status_favs(
        data: AniFavPayloadSchema, user: UserLogRespSchema
    ) -> AniFavRespSchema:
        # Antes de actualizar o insertar la relacion se verifica que sea un anime existente
        anime = await AnimeModel.find_by_id(ObjectId(data.animeId))
        if not anime:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Anime no encontrado",
            )
        try:
            nowTS = time_now_formatted(True)
            updated = await UTAFavsModel.update_one(
                {"user": ObjectId(user.id), "anime": ObjectId(data.animeId)},
                {
                    "$set": {
                        "anime": ObjectId(data.animeId),
                        "user": ObjectId(user.id),
                        "active": data.active,
                        "statusView": data.statusView,
                        "fechaAdicion": nowTS,
                    }
                },
                upsert=True,
            )  # Actualizamos el registro o insertamos en caso de que no exista la relacion

            return AniFavRespSchema(active=data.active, statusView=data.statusView)
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar agregar el anime a favoritos",
            )

    # Metodos para administrador
    # Crear anime
    @staticmethod
    async def create_anime(payload: AnimeCreateSchema) -> ResponseUpdCrtAnime:
        # Verificamso si no existe un anime con el mismo key_anime
        existing_anime = await AnimeModel.find_one({"key_anime": payload.key_anime})
        if existing_anime:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un anime con el mismo key_anime",
            )

        try:
            # Antes de crearlo agregamos la fecha en que se crea
            anime_to_create = payload.model_dump()
            anime_to_create["fechaAdicion"] = time_now_formatted(True)
            # Creamos el nuevo anime
            insertedId = await AnimeModel.insert_one(anime_to_create)
            logger.info(f"Anime registrado: {insertedId}")
            return ResponseUpdCrtAnime(message="Anime creado correctamente")
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar agregar el anime",
            )

    # Actualizacion del anime
    @staticmethod
    async def update_anime(
        anime_id: ObjectIdStr, payload: AnimeUpdateSchema
    ) -> ResponseUpdCrtAnime:
        if payload and (payload.id_MAL or payload.key_anime):
            # Primero revisamos si no existe algun otro anime que contenga el mismo id_MAL o key_anime al que se quiere actualizar y que no sea el anime que qeuremos actualizar (lo excluimos por su id)
            # Esto solo lo hacemos si se recibe el key anime y/o el id_MAL en el payload
            k_anime_query = (
                {"key_anime": payload.key_anime} if payload.key_anime else None
            )
            id_mal_query = {"id_MAL": payload.id_MAL} if payload.id_MAL else None
            or_query = None
            if payload.id_MAL and payload.key_anime:
                k_anime_query = {"key_anime": payload.key_anime}
                id_mal_query = {"id_MAL": payload.id_MAL}
                or_query = {"$or": [k_anime_query, id_mal_query]}
            is_existing = await AnimeModel.aggregate(
                [
                    {
                        "$match": {
                            "$and": [
                                (
                                    or_query
                                    if or_query
                                    else (
                                        k_anime_query if k_anime_query else id_mal_query
                                    )
                                ),
                                {"_id": {"$not": {"$eq": ObjectId(anime_id)}}},
                            ]
                        }
                    }
                ]
            )

            if is_existing and len(is_existing) > 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Ya existe un anime con el mismo id_MAL o key_anime",
                )

        try:
            # Actualizamos el anime si existe
            data = payload.model_dump(
                exclude_unset=True
            )  # Obtenemos solo los campos que traen algun valor diferente de None
            animeUpd = await AnimeModel.find_and_update(
                {"_id": ObjectId(anime_id)}, data, upsert=False
            )
            if not animeUpd:  # Si no se encuntra el anime a actualizar
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No se encontro el anime a actualizar",
                )
            return ResponseUpdCrtAnime(message="Anime actualizado correctamente")
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar actualizar el anime",
            )

    # Eliminar anime
    @staticmethod
    async def delete_anime(anime_id: ObjectId) -> ResponseUpdCrtAnime:
        try:
            # Eliminamos el anime si existe
            animeDel = await AnimeModel.delete_one({"_id": ObjectId(anime_id)})
            if animeDel.deleted_count == 0:  # Si no se encuntra el anime a eliminar
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No se encontro el anime a eliminar",
                )
            return ResponseUpdCrtAnime(message="Anime eliminado correctamente")
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar eliminar el anime",
            )

    # Lo siguiente seria agregar las funciones de uso de api jikan
    # Buscar un anime en MAL por el titulo
    @staticmethod
    async def search_anime_mal(
        payload: PayloadSearchAnimeMAL,
    ) -> ResponseSearchAnimeMAL:
        ##Realizamos la busqueda
        results = await JikanService.search_mal(
            payload.tit_search, TipoContMALEnum.anime
        )
        totalResults = (
            results.get("pagination", {}).get("items", {}).get("count")
        )  # Obtenemos el total de los resultados
        listAnimes = [
            AnimeMALSearch(
                id_MAL=anime.get("mal_id"),
                linkMAL=anime.get("url"),
                image=anime.get("images").get("jpg").get("small_image_url"),
                titulo=anime.get("title"),
                tipo=anime.get("type"),
            )
            for anime in results.get("data")
        ]  # Creamos la lista de los resultados
        return ResponseSearchAnimeMAL(
            listaAnimes=listAnimes, totalResults=totalResults if totalResults else 0
        )

    # Asignar el IDMAL al anime
    @staticmethod
    async def assign_id_mal_anime(payload: PayloadAnimeIDMAL) -> ResponseUpdCrtAnime:
        # Reviamos si existe un anime con el mismo idmal que queremos asignar
        existing_anime = await AnimeModel.find_one({"id_MAL": payload.id_MAL})
        if existing_anime:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ya existe un anime con el mismo id_MAL",
            )

        # Si no existe un anime con el mismo id mal, asignamos al actual
        try:
            animeUpd = await AnimeModel.update_one(
                {"_id": ObjectId(payload.id)},
                {"$set": {"id_MAL": payload.id_MAL}},
                False,
            )

            return ResponseUpdCrtAnime(
                message=f"Anime actualizado al ID MAL {payload.id_MAL} correctamente"
            )
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar actualizar el anime",
            )

    # Actualizar un anime sin actualizar con la informacion de MAL
    @staticmethod
    async def update_anime_from_mal(
        animeId: ObjectIdStr,
        id_MAL: Optional[int] = None,
        key_anime: Optional[int] = None,
        is_all: bool = False,
    ) -> RespUpdMALAnimeSchema:
        # Si solo se esta actualizando un anime, entonces primero se revisa si este existe
        if not is_all:
            # Revisamos si existe
            is_exists = await AnimeModel.find_by_id(ObjectId(animeId))
            logger.debug(is_exists)
            if not is_exists:
                return RespUpdMALAnimeSchema(
                    message="No se encontro el anime a actualizar", is_success=False
                )
            id_MAL = is_exists.get(
                "id_MAL"
            )  # Al encontrarlo actualizamos el id mal del anime para lo que sigue
            key_anime = is_exists.get("key_anime")

        try:
            # Buscamos la informacion
            animeMAL = await JikanService.get_data_anime(id_MAL)
            # Si no se encuentra nada
            if not animeMAL:
                return RespUpdMALAnimeSchema(
                    message="Error al intentar obtener la informacion del anime desde MAL",
                    is_success=False,
                )

            n_generos = animeMAL.get("generos")
            n_studios = animeMAL.get("studios")
            # Preparamos la informacion para la actualizacion
            animeMAL = AnimeUpdateSchema.model_validate(animeMAL)
            animeMAL.key_anime = key_anime
            animeUpd = await AnimeService.update_anime(
                payload=animeMAL, anime_id=animeId
            )
            # Ahora hay que insertar generos o estudios de animacion nuevos que tenga el anime recien actualizado
            for genero in n_generos:
                rg = await AnimeService.create_genre(
                    CreateGenreSchema(
                        nombre=genero.get("nombre"),
                        id_MAL=genero.get("id_MAL"),
                        nombre_mal=genero.get("nombre"),
                        linkMAL=genero.get("linkMAL"),
                    )
                )
            for studio in n_studios:
                re = await AnimeService.create_studio(
                    CreateStudioSchema(
                        nombre=studio.get("nombre"),
                        id_MAL=studio.get("id_MAL"),
                        linkMAL=studio.get("linkMAL"),
                        fechaAdicion=time_now_formatted(True),
                    )
                )

            return RespUpdMALAnimeSchema(
                message="Anime Actualizado Correctamente", is_success=True
            )
        except Exception as e:
            logger.debug(str(e))
            return RespUpdMALAnimeSchema(
                message="Ocurrio un error al intentar actualizar la informacion",
                is_success=False,
            )

    # Actualizar todos los animes sin actualizar a MAL
    @staticmethod
    async def update_all_animes_from_mal() -> ResponseUpdAllMALSchema:
        try:
            responses = []
            # Obtenemos los animes que tienen la informacion incompleta pero que ya tienen asigndo un id_mal
            animes_to_upd = objects_id_list_to_str(
                await AnimeModel.aggregate(filtrado_info_incompleta(True))
            )

            for atu in animes_to_upd:
                # Actualizamos la informacion
                resp = await AnimeService.update_anime_from_mal(
                    atu.get("_id") or atu.get("id") or atu.get("Id"),
                    atu.get("id_MAL"),
                    atu.get("key_anime"),
                    True,
                )
                # Agregamos la respuesta
                responses.append(resp)

            success_count = sum(
                1 for r in responses if r.is_success
            )  # Realizamos el conteo de los animes que se actualizaron correctamente

            return ResponseUpdAllMALSchema(
                message=f"Se llevo a cabo la actualizacion de {success_count} animes",
                totalToAct=len(responses),
                totalAct=success_count,
            )
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar actualizar los animes con informacion incompleta",
            )

    # Insertar/Actualizar genero
    @staticmethod
    async def create_genre(genre: CreateGenreSchema) -> RespUpdMALAnimeSchema:
        try:
            # Si encuentra el genero actualiza la informacion, si no lo encuentra al insertar agrega el id_MAL y la fecha de adicion
            new_genre = await GeneroModel.update_one(
                {"id_MAL": genre.id_MAL},
                {
                    "$set": {
                        "nombre": genre.nombre,
                        "nombre_mal": genre.nombre_mal,
                        "linkMAL": genre.linkMAL,
                    },
                    "$setOnInsert": {
                        "fechaAdicion": time_now_formatted(True),
                        "id_MAL": genre.id_MAL,
                    },
                },
                True,
            )
            return RespUpdMALAnimeSchema(
                message="Genero Creado Correctamente", is_success=True
            )
        except:
            # raise HTTPException(
            #     status_code=status.HTTP_400_BAD_REQUEST,
            #     detail="Error al intentar actualizar el anime",
            # )
            return RespUpdMALAnimeSchema(
                message="Ocurrio un error al intentar agregar el genero",
                is_success=False,
            )

    # Insertar/Actualizar Estudios de animacion
    @staticmethod
    async def create_studio(studio: CreateStudioSchema) -> RespUpdMALAnimeSchema:
        try:
            new_studio = await StudioModel.update_one(
                {"id_MAL": studio.id_MAL},
                {
                    "$set": {
                        "nombre": studio.nombre,
                        "linkMAL": studio.linkMAL,
                    },
                    "$setOnInsert": {
                        "fechaAdicion": time_now_formatted(True),
                        "id_MAL": studio.id_MAL,
                    },
                },
                True,
            )
            return RespUpdMALAnimeSchema(
                message="Estudio de animacion agregado correctamente",
                is_success=True,
            )
        except:
            return RespUpdMALAnimeSchema(
                message="Ocurrio un error al intentar agregar el estudio de animacion",
                is_success=False,
            )
