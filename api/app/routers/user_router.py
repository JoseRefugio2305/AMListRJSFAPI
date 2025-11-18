from fastapi import APIRouter, Depends, Path, HTTPException
import re

from app.services.user_services import UserService
from app.services.anime import AnimeService
from app.services.manga import MangaService
from app.core.security import get_current_user, optional_current_user
from app.core.utils import str_trim_lower
from app.schemas.auth import (
    UserLogRespSchema,
    USERNAME_REGEX,
    PayloadProfPicSchema,
    PayloadUsernameSchema,
    PayloadEmailSchema,
    PayloadPassSchema,
    ResponseNewPassSchema,
)
from app.schemas.search import FilterSchema, AnimeSearchSchema, MangaSearchSchema
from app.schemas.stats import FavsCountSchema, TypeStatisticEnum
from app.services.stats_service import StatsService
from app.core.logging import get_logger


logger = get_logger(__name__)

# Creamos el router con el prefijo y la tag de la documentacion
routerUser = APIRouter(prefix="/user", tags=["user"])


# Verificamos el formato del username
def val_username(username: str) -> str:
    username = str_trim_lower(username)
    if not re.fullmatch(USERNAME_REGEX, username):
        raise HTTPException(
            status_code=400,
            detail="Formato de username invalido, debe terner letras, digitos y guienes bajos y medios.",
        )
    return username


# Obtener informacion de perfil propio
@routerUser.get("/me/", response_model=UserLogRespSchema)
async def me(user: UserLogRespSchema = Depends(get_current_user)):
    user.access_token = ""
    return user


# Obtener informacion de otro perfil de usuario
@routerUser.get("/{username}", response_model=UserLogRespSchema)
async def profile(
    username: str = Path(
        ...,
        min_length=8,
        max_length=16,
        description="La extension minima es de 8 caracteres y la maxima es de 16.",
    ),
    user: UserLogRespSchema = Depends(optional_current_user),
):
    username = val_username(username)

    # Si el usuario esta logeado hay qye verificar si su username coincide con el que busca, si no coincide hay que obtener la informacion de este otro usuario
    if user:
        if user.name != username:
            user = await UserService.get_UserInfo(username)

    user.access_token = ""
    user = user.model_dump()

    return user


# Obtencion de estadisticas del usuario
@routerUser.get("/stats/{username}", response_model=FavsCountSchema)
async def estadisticas(
    username: str = Path(
        ...,
        min_length=8,
        max_length=16,
        description="La extension minima es de 8 caracteres y la maxima es de 16.",
    ),
    tipoStats: TypeStatisticEnum = TypeStatisticEnum.a_m_favs,
    user: UserLogRespSchema = Depends(optional_current_user),
) -> FavsCountSchema:
    username = val_username(username)

    # Si el usuario esta logeado hay qye verificar si su username coincide con el que busca, si no coincide hay que obtener la informacion de este otro usuario
    if user:
        if user.name != username:
            user = await UserService.get_UserInfo(username)
    # Si queremos el conteo de favoritos
    if tipoStats == TypeStatisticEnum.a_m_favs:
        conteoFavoritos = await StatsService.get_count_favs(user)
        return conteoFavoritos.model_dump()
    else:  # Si queremos alguna otra estadistica
        stats = await StatsService.get_stats(True, user, tipoStats)
        return stats.model_dump()


# Lista de animes favoritos de un usuario especifico
@routerUser.post("/anime_list/{username}", response_model=AnimeSearchSchema)
async def get_anime_list(
    username: str = Path(
        ...,
        min_length=8,
        max_length=16,
        description="La extension minima es de 8 caracteres y la maxima es de 16.",
    ),
    filters: FilterSchema = FilterSchema(),
    user: UserLogRespSchema = Depends(optional_current_user),
):

    username = val_username(username)

    # Si el usuario esta logeado hay qye verificar si su username coincide con el que busca, si no coincide hay que obtener la informacion de este otro usuario
    if user:
        if user.name != username:
            user = await UserService.get_UserInfo(username)

    animeList = await AnimeService.get_all(filters, user)

    return animeList.model_dump()


# Lista de mangas favoritos de un usuario especifico
@routerUser.post("/manga_list/{username}", response_model=MangaSearchSchema)
async def get_manga_list(
    username: str = Path(
        ...,
        min_length=8,
        max_length=16,
        description="La extension minima es de 8 caracteres y la maxima es de 16.",
    ),
    filters: FilterSchema = FilterSchema(),
    user: UserLogRespSchema = Depends(optional_current_user),
):
    # Verificamos el formato del username
    username = val_username(username)

    # Si el usuario esta logeado hay qye verificar si su username coincide con el que busca, si no coincide hay que obtener la informacion de este otro usuario
    if user:
        if user.name != username:
            user = await UserService.get_UserInfo(username)

    mangaList = await MangaService.get_all(filters, user)

    return mangaList.model_dump()


# Cambio de foto de perfil
@routerUser.post("/change_profpic/", response_model=PayloadProfPicSchema)
async def change_profpic(
    profPic: PayloadProfPicSchema, user: UserLogRespSchema = Depends(get_current_user)
):
    response = await UserService.changeProfPic(profPic, user)

    return response.model_dump()


# Cambio de nombre de usuario
@routerUser.post("/change_username/", response_model=PayloadUsernameSchema)
async def change_username(
    newUNData: PayloadUsernameSchema,
    user: UserLogRespSchema = Depends(get_current_user),
):

    response = await UserService.change_username(newUNData, user)

    return response.model_dump()


# Cambio de email
@routerUser.post("/change_email/", response_model=PayloadEmailSchema)
async def change_email(
    new_emaildata: PayloadEmailSchema,
    user: UserLogRespSchema = Depends(get_current_user),
):
    response = await UserService.change_email(new_emaildata, user)

    return response.model_dump()


# Cambio de password
@routerUser.post("/change_password/", response_model=ResponseNewPassSchema)
async def change_pass(
    new_passdata: PayloadPassSchema, user: UserLogRespSchema = Depends(get_current_user)
):
    response = await UserService.change_pass(new_passdata, user)
    return response.model_dump()
