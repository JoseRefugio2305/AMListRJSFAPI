from fastapi import HTTPException, status
from bson.objectid import ObjectId
import math

from app.models.user_model import UserModel
from app.schemas.auth import (
    UserLogRespSchema,
    PayloadProfPicSchema,
    PayloadUsernameSchema,
    PayloadEmailSchema,
    PayloadPassSchema,
    ResponseNewPassSchema,
    RolEnum,
)
from app.schemas.search import ActiveUserEnum, UserListFilterSchema
from app.schemas.auth import UserListSchema, PayloadActiveStateSchema
from app.core.utils import object_id_to_str, objects_id_list_to_str, UsernameType
from app.services.auth_service import verify_pass, get_pass_hash

from app.core.logging import get_logger

logger = get_logger(__name__)


def dict_to_user_schema(userInfo: dict) -> UserLogRespSchema:
    return UserLogRespSchema(
        id=userInfo.get("_id") or userInfo.get("id") or userInfo.get("Id"),
        name=userInfo.get("name"),
        email=userInfo.get("email"),
        rol=userInfo.get("rol", RolEnum.base_user),
        is_active=userInfo.get("is_active", True),
        profile_pic=userInfo.get("profile_pic"),
        created_date=userInfo.get("created_date"),
        show_statistics=userInfo.get("show_statistics"),
        access_token="",
    )


class UserService:

    # Obtener la informacion del usuario, por medio del username
    @staticmethod
    async def get_UserInfo(username: UsernameType) -> UserLogRespSchema:
        userInfo = object_id_to_str(
            await UserModel.find_by_email(
                email="", username=username, tipoactive=ActiveUserEnum.activo
            )
        )

        if not userInfo:  # Si no se encontro informacion
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return dict_to_user_schema(userInfo)
        # UserLogRespSchema(
        #     id=userInfo.get("_id") or userInfo.get("id") or userInfo.get("Id"),
        #     name=userInfo.get("name"),
        #     email=userInfo.get("email"),
        #     rol=userInfo.get("rol", RolEnum.base_user),
        #     is_active=userInfo.get("is_active", True),
        #     profile_pic=userInfo.get("profile_pic"),
        #     created_date=userInfo.get("created_date"),
        #     show_statistics=userInfo.get("show_statistics"),
        #     access_token="",
        # )

    # Cambio de goto de perfil
    @staticmethod
    async def change_profpic(
        profpicData: PayloadProfPicSchema, user: UserLogRespSchema
    ) -> PayloadProfPicSchema:
        try:
            # Actualizamos la imagen de perfil
            newPP = await UserModel.update_one(
                {"_id": ObjectId(user.id)},
                {"$set": {"profile_pic": profpicData.profile_pic}},
                False,
            )
            return profpicData
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar cambiar la foto de perfil.",
            )

    # Cambio de username
    @staticmethod
    async def change_username(
        new_username_data: PayloadUsernameSchema, user: UserLogRespSchema
    ) -> PayloadUsernameSchema:

        # Primero verificamos si no existe otro usuario que coincida con el nuevo nombre de usuario
        is_exists = await UserModel.find_by_email(
            email="",
            username=new_username_data.new_name,
            tipoactive=ActiveUserEnum.todos,
        )
        if is_exists:
            raise ValueError("Ya existe un usuario registrado con ese username.")

        try:
            # Si no existe realizamos la actualizacion
            new_username = await UserModel.update_one(
                {"_id": ObjectId(user.id)},
                {"$set": {"name": new_username_data.new_name}},
                False,
            )
            return new_username_data
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar cambiar el username.",
            )

    # Actualizacion del correo
    @staticmethod
    async def change_email(
        new_emaildata: PayloadEmailSchema, user: UserLogRespSchema
    ) -> PayloadEmailSchema:
        # Primero revisamos si no existe otro ususario con el mismo email al que se quiere atualizar
        is_exists = await UserModel.find_by_email(
            email=new_emaildata.new_email, username="", tipoactive=ActiveUserEnum.todos
        )

        if is_exists:
            raise ValueError("Ya existe un usuario registrado con ese email.")

        try:
            # Si no existe actualizamos
            new_email = await UserModel.update_one(
                {"_id": ObjectId(user.id)},
                {"$set": {"email": new_emaildata.new_email}},
                False,
            )
            return new_emaildata
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar cambiar el email.",
            )

    # Cambio de contraseña
    @staticmethod
    async def change_pass(
        new_passdata: PayloadPassSchema, user: UserLogRespSchema
    ) -> ResponseNewPassSchema:
        # Obtenemos el hash de la contraseña anterior
        old_pass_hash = await UserModel.find_by_email(
            email=user.email, username="", tipoactive=ActiveUserEnum.activo
        )

        # Si la contraseña no es correcta
        if not verify_pass(new_passdata.old_pass, old_pass_hash.get("password")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Contraseña incorrecta. ",
            )
        # Si la contraseña es correcta procedemos a actualizarla
        try:
            # Obtenemos el nuevo hash de la contraseña
            new_pass_hash = get_pass_hash(new_passdata.new_pass)
            new_pass = await UserModel.update_one(
                {"_id": ObjectId(user.id)}, {"$set": {"password": new_pass_hash}}, False
            )
            return ResponseNewPassSchema()
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar cambiar la contraseña.",
            )

    # Obtener listado de usuarios para el dashboard
    @staticmethod
    async def get_users_list(
        userFilters: UserListFilterSchema,
    ) -> UserListSchema:
        # Revisamos que tipo de usuario activo, inactivo o todos
        query_active = (
            [
                {
                    "is_active": (
                        True
                        if userFilters.is_active == ActiveUserEnum.activo
                        else False
                    )
                }
            ]
            if userFilters.is_active != ActiveUserEnum.todos
            else []
        )
        if len(userFilters.txtSearch) > 0:
            # Si quiere realizar una busqueda por username o email la agregamos
            query_active.append(
                {
                    "$or": [
                        {"name": {"$regex": userFilters.txtSearch}},
                        {"email": {"$regex": userFilters.txtSearch}},
                    ]
                }
            )
        # Preparamos la consulta base
        pipeline = [{"$match": {"$and": query_active}}] if len(query_active) > 0 else []
        logger.debug(pipeline)
        # Realizamos conteo
        totalUsers = await UserModel.aggregate([*pipeline, {"$count": "totalUsers"}])
        totalUsers = totalUsers[0]["totalUsers"] if len(totalUsers) > 0 else 0

        # Aplicamos la limitacion a la busqueda
        pipeline.append({"$skip": (userFilters.page - 1) * userFilters.limit})
        pipeline.append({"$limit": userFilters.limit})

        results = (
            objects_id_list_to_str(await UserModel.aggregate(pipeline))
            if totalUsers
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        return UserListSchema(
            total=totalUsers,
            page=userFilters.page,
            totalPages=math.ceil(totalUsers / userFilters.limit),
            userList=[dict_to_user_schema(userInfo) for userInfo in results],
        )

    # Cambiar el estado activo de un usuario
    @staticmethod
    async def change_active_state(
        payload: PayloadActiveStateSchema,
    ) -> PayloadActiveStateSchema:

        # Realizamos la actualizacion
        userActive = await UserModel.find_and_update(
            {"_id": ObjectId(payload.userId)},
            {"is_active": payload.is_active},
            upsert=False,
        )

        if not userActive:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar cambiar el estado activo del usuario.",
            )
        return PayloadActiveStateSchema(
            userId=payload.userId, is_active=payload.is_active
        )
