from fastapi import HTTPException, status
from bson.objectid import ObjectId

from app.schemas.auth import UserLogRespSchema
from app.models.user_model import UserModel
from app.schemas.auth import (
    UserLogRespSchema,
    PayloadProfPicSchema,
    PayloadUsernameSchema,
    PayloadEmailSchema,
    PayloadPassSchema,
    ResponseNewPassSchema,
)
from app.core.utils import object_id_to_str
from app.services.auth_service import verify_pass, get_pass_hash

from app.core.logging import get_logger

logger = get_logger(__name__)


class UserService:

    # Obtener la informacion del usuario, por medio del username
    @staticmethod
    async def get_UserInfo(username: str) -> UserLogRespSchema:
        userInfo = object_id_to_str(await UserModel.find_by_email("", username))

        if not userInfo:  # Si no se encontro informacion
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return UserLogRespSchema(
            id=userInfo.get("_id") or userInfo.get("id") or userInfo.get("Id"),
            name=userInfo.get("name"),
            email=userInfo.get("email"),
            rol=userInfo.get("rol", 0),
            profile_pic=userInfo.get("profile_pic"),
            created_date=userInfo.get("created_date"),
            show_statistics=userInfo.get("show_statistics"),
            access_token="",
        )

    # Cambio de goto de perfil
    @staticmethod
    async def change_profpic(
        profpicData: PayloadProfPicSchema, user: UserLogRespSchema
    ) -> PayloadProfPicSchema:
        try:
            # Actualizamos la imagen de perfil
            newPP = await UserModel.update_one(
                {"_id": ObjectId(user.id)}, {"profile_pic": profpicData.profile_pic}
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
            "", username=new_username_data.new_name
        )
        if is_exists:
            raise ValueError("Ya existe un usuario registrado con ese username.")

        try:
            # Si no existe realizamos la actualizacion
            new_username = await UserModel.update_one(
                {"_id": ObjectId(user.id)}, {"name": new_username_data.new_name}
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
        is_exists = await UserModel.find_by_email(new_emaildata.new_email, "")

        if is_exists:
            raise ValueError("Ya existe un usuario registrado con ese email.")

        try:
            # Si no existe actualizamos
            new_email = await UserModel.update_one(
                {"_id": ObjectId(user.id)}, {"email": new_emaildata.new_email}
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
        old_pass_hash = await UserModel.find_by_email(user.email, "")

        logger.debug(old_pass_hash.get("password"))

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
                {"_id": ObjectId(user.id)}, {"password": new_pass_hash}
            )
            return ResponseNewPassSchema()
        except HTTPException:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar cambiar la contraseña.",
            )
