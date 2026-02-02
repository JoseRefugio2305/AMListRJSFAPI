from fastapi import APIRouter, Depends, HTTPException, Request

from app.services.user_services import UserService
from app.services.anime import AnimeService
from app.services.manga import MangaService
from app.core.security import get_current_user, optional_current_user
from app.core.utils import UsernameType
from app.schemas.auth import (
    UserLogRespSchema,
    PayloadProfPicSchema,
    PayloadUsernameSchema,
    PayloadEmailSchema,
    ResponseEmailSchema,
    PayloadPassSchema,
    ResponseNewPassSchema,
)
from app.schemas.search import FilterSchema, AnimeSearchSchema, MangaSearchSchema
from app.schemas.stats import FavsCountSchema, TypeStatisticEnum
from app.services.stats_service import StatsService
from app.core.security.rate_limiter import limiter
from app.core.logging import get_logger


logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerUser = APIRouter(prefix="/user", tags=["user"])


async def resolve_target_user(username, user):
    # Si el usuario esta logeado hay qye verificar si su username coincide con el que busca, si no coincide hay que obtener la informacion de este otro usuario
    if not user or user.name != username:
        return await UserService.get_UserInfo(username)
    return user


# Obtener informacion de perfil propio
@routerUser.get("/me/", response_model=UserLogRespSchema)
async def me(user: UserLogRespSchema = Depends(get_current_user)):
    user.access_token = ""
    return user


# Obtener informacion de otro perfil de usuario
@routerUser.get("/{username}", response_model=UserLogRespSchema)
@limiter.limit("60/minute")
async def profile(
    request: Request,
    username: UsernameType,
    user: UserLogRespSchema = Depends(optional_current_user),
):

    user = await resolve_target_user(username, user)

    user.access_token = ""
    user = user.model_dump()

    return user


# Obtencion de estadisticas del usuario
@routerUser.get("/stats/{username}", response_model=FavsCountSchema)
@limiter.limit("60/minute")
async def estadisticas(
    request: Request,
    username: UsernameType,
    tipoStats: TypeStatisticEnum = TypeStatisticEnum.a_m_favs,
    user: UserLogRespSchema = Depends(optional_current_user),
) -> FavsCountSchema:
    user = await resolve_target_user(username, user)
    # Si queremos el conteo de favoritos
    if tipoStats == TypeStatisticEnum.a_m_favs:
        conteoFavoritos = await StatsService.get_count_favs(user)
        return conteoFavoritos.model_dump()
    else:  # Si queremos alguna otra estadistica
        stats = await StatsService.get_stats(True, user, tipoStats)
        return stats.model_dump()


# Lista de animes favoritos de un usuario especifico
@routerUser.post("/anime_list/{username}", response_model=AnimeSearchSchema)
@limiter.limit("30/minute")
async def get_anime_list(
    request: Request,
    username: UsernameType,
    filters: FilterSchema = FilterSchema(),
    user: UserLogRespSchema = Depends(optional_current_user),
):
    user = await resolve_target_user(username, user)

    animeList = await AnimeService.get_all(filters, user)

    return animeList.model_dump()


# Lista de mangas favoritos de un usuario especifico
@routerUser.post("/manga_list/{username}", response_model=MangaSearchSchema)
@limiter.limit("30/minute")
async def get_manga_list(
    request: Request,
    username: UsernameType,
    filters: FilterSchema = FilterSchema(),
    user: UserLogRespSchema = Depends(optional_current_user),
):
    user = await resolve_target_user(username, user)

    mangaList = await MangaService.get_all(filters, user)

    return mangaList.model_dump()


# Cambio de foto de perfil
@routerUser.post("/change_profpic/", response_model=PayloadProfPicSchema)
async def change_profpic(
    profPic: PayloadProfPicSchema, user: UserLogRespSchema = Depends(get_current_user)
):
    response = await UserService.change_profpic(profPic, user)

    return response.model_dump()


# Cambio de nombre de usuario
@routerUser.post("/change_username/", response_model=PayloadUsernameSchema)
async def change_username(
    newUNData: PayloadUsernameSchema,
    user: UserLogRespSchema = Depends(get_current_user),
):

    try:
        response = await UserService.change_username(newUNData, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return response.model_dump()


# Cambio de email
@routerUser.post("/change_email/", response_model=ResponseEmailSchema)
async def change_email(
    new_emaildata: PayloadEmailSchema,
    user: UserLogRespSchema = Depends(get_current_user),
):
    try:
        response = await UserService.change_email(new_emaildata, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return response.model_dump()


# Cambio de password
@routerUser.post("/change_password/", response_model=ResponseNewPassSchema)
async def change_pass(
    new_passdata: PayloadPassSchema, user: UserLogRespSchema = Depends(get_current_user)
):
    try:
        response = await UserService.change_pass(new_passdata, user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return response.model_dump()
