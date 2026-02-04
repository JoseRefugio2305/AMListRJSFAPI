from bson import ObjectId

from app.models.user_model import UserModel
from app.core.utils import ObjectIdStr
from ..pipeline_builders.common import apply_paginacion_ordenacion
from app.schemas.auth import (
    PayloadProfPicSchema,
    PayloadUsernameSchema,
    PayloadEmailSchema,
    PayloadActiveStateSchema,
)
from app.schemas.search import UserListFilterSchema, ActiveUserEnum, UserTypeEnum
from app.core.logging import get_logger

logger = get_logger(__name__)


class UserRepository:

    @staticmethod
    async def get_all_filtered(userFilters: UserListFilterSchema):
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

        if userFilters.userType != UserTypeEnum.todos:
            query_active.append({"rol": userFilters.userType})
        # Preparamos la consulta base
        pipeline = [{"$match": {"$and": query_active}}] if len(query_active) > 0 else []
        pipeline = [
            {
                "$facet": {
                    "totales": [*pipeline, {"$count": "totalUsers"}],
                    "usuarios": [
                        *pipeline,
                        *apply_paginacion_ordenacion(
                            userFilters.limit,
                            userFilters.page,
                            userFilters.orderBy,
                            userFilters.orderField,
                            False,
                        ),
                    ],
                }
            }
        ]
        logger.debug(pipeline)
        # Realizamos conteo
        results = await UserModel.aggregate(pipeline)
        totalUsers = (
            results[0]["totales"][0]["totalUsers"]
            if len(results[0]["totales"]) > 0
            else 0
        )
        results = (
            results[0]["usuarios"]
            if totalUsers
            > 0  # Si el total del conteo da 0, no hacemos esta consulta simplemente damos lista vacia
            else []
        )

        return results, totalUsers

    @staticmethod
    async def update_prof_pic(
        prof_pic_data: PayloadProfPicSchema, user_id: ObjectIdStr
    ):
        new_pp = await UserModel.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"profile_pic": prof_pic_data.profile_pic}},
            False,
        )

        return new_pp

    @staticmethod
    async def change_username(
        new_username_data: PayloadUsernameSchema, user_id: ObjectIdStr
    ):
        new_username = await UserModel.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"name": new_username_data.new_name}},
            False,
        )

        return new_username

    @staticmethod
    async def change_email(new_emaildata: PayloadEmailSchema, user_id: ObjectIdStr):
        new_email = await UserModel.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"email": new_emaildata.new_email}},
            False,
        )
        return new_email

    @staticmethod
    async def change_pass(new_pass_hash: str, user_id: ObjectIdStr):
        new_pass = await UserModel.update_one(
            {"_id": ObjectId(user_id)}, {"$set": {"password": new_pass_hash}}, False
        )

        return new_pass

    @staticmethod
    async def change_status_active(
        payload: PayloadActiveStateSchema,
    ):
        user_active = await UserModel.find_and_update(
            {"_id": ObjectId(payload.userId)},
            {"is_active": payload.is_active},
            upsert=False,
        )
        return user_active
