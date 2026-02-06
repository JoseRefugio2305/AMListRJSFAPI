from fastapi import HTTPException, status
import math

from app.schemas.auth import (
    UserLogRespSchema,
    PayloadProfPicSchema,
    PayloadUsernameSchema,
    PayloadEmailSchema,
    ResponseEmailSchema,
    PayloadPassSchema,
    ResponseNewPassSchema,
)
from app.schemas.search import ActiveUserEnum, UserListFilterSchema
from app.schemas.auth import UserListSchema, PayloadActiveStateSchema
from app.core.utils import (
    object_id_to_str,
    objects_id_list_to_str,
    UsernameType,
)
from app.services.auth_service import verify_pass, get_pass_hash
from app.core.security import create_access_token
from app.repositories.auth import AuthRepository
from app.repositories.user import UserRepository
from app.models.user_model import UserModel
from app.core.logging import get_logger

logger = get_logger(__name__)


class UserService:

    # Obtener la informacion del usuario, por medio del username
    @staticmethod
    async def get_UserInfo(username: UsernameType) -> UserLogRespSchema:
        userInfo = object_id_to_str(
            await AuthRepository.find_by_email(
                email="", username=username, tipoactive=ActiveUserEnum.activo
            )
        )

        if not userInfo:  # Si no se encontro informacion
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return UserModel.to_user(userInfo, "")

    # Cambio de goto de perfil
    @staticmethod
    async def change_profpic(
        profpicData: PayloadProfPicSchema, user: UserLogRespSchema
    ) -> PayloadProfPicSchema:
        try:
            # Actualizamos la imagen de perfil
            newPP = await UserRepository.update_prof_pic(profpicData, user.id)
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
        # Revisamos si el antiguo username(el actual) en el payload es igual al actual
        if new_username_data.old_name != user.name:
            raise HTTPException(status_code=400, detail="Username actual incorrecto")
        # Primero verificamos si no existe otro usuario que coincida con el nuevo nombre de usuario
        is_exists = await AuthRepository.find_by_email(
            email="",
            username=new_username_data.new_name,
            tipoactive=ActiveUserEnum.todos,
        )
        if is_exists:
            raise ValueError("Ya existe un usuario registrado con ese username.")

        try:
            # Si no existe realizamos la actualizacion
            new_username = await UserRepository.change_username(
                new_username_data, user.id
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
    ) -> ResponseEmailSchema:
        # Revisamos si el email antiguo(actual) en el payload es igual al actual
        if new_emaildata.old_email != user.email:
            raise HTTPException(status_code=400, detail="Email actual incorrecto")
        # Primero revisamos si no existe otro ususario con el mismo email al que se quiere atualizar
        is_exists = await AuthRepository.find_by_email(
            email=new_emaildata.new_email, username="", tipoactive=ActiveUserEnum.todos
        )

        if is_exists:
            raise ValueError("Ya existe un usuario registrado con ese email.")

        try:
            # Si no existe actualizamos
            new_email = await UserRepository.change_email(new_emaildata, user.id)
            access_token = create_access_token(subject=new_emaildata.new_email)
            return ResponseEmailSchema(
                new_email=new_emaildata.new_email,
                old_email=new_emaildata.old_email,
                access_token=access_token,
            )
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
        old_pass_hash = await AuthRepository.find_by_email(
            email=user.email, username="", tipoactive=ActiveUserEnum.activo
        )

        # Si la contraseña no es correcta
        if not verify_pass(new_passdata.old_pass, old_pass_hash.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Contraseña incorrecta. ",
            )
        # Si la contraseña es correcta procedemos a actualizarla
        try:
            # Obtenemos el nuevo hash de la contraseña
            new_pass_hash = get_pass_hash(new_passdata.new_pass)
            new_pass = await UserRepository.change_pass(new_pass_hash, user.id)
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
        results, totalUsers = await UserRepository.get_all_filtered(userFilters)
        results = objects_id_list_to_str(results)

        return UserListSchema(
            total=totalUsers,
            page=userFilters.page,
            totalPages=math.ceil(totalUsers / userFilters.limit),
            userList=[UserModel.to_user(userInfo, "") for userInfo in results],
        )

    # Cambiar el estado activo de un usuario
    @staticmethod
    async def change_active_state(
        payload: PayloadActiveStateSchema,
    ) -> PayloadActiveStateSchema:

        # Realizamos la actualizacion
        user_active = await UserRepository.change_status_active(payload)

        if not user_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Error al intentar cambiar el estado activo del usuario.",
            )
        return PayloadActiveStateSchema(
            userId=payload.userId, is_active=payload.is_active
        )
