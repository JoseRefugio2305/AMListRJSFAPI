def dict_to_user_schema(userInfo: dict, token: str):
    from app.schemas.auth import UserLogRespSchema, RolEnum

    return UserLogRespSchema(
        id=userInfo.get("_id") or userInfo.get("id") or userInfo.get("Id"),
        name=userInfo.get("name"),
        email=userInfo.get("email"),
        rol=userInfo.get("rol", RolEnum.base_user),
        is_active=userInfo.get("is_active", True),
        profile_pic=userInfo.get("profile_pic"),
        created_date=userInfo.get("created_date"),
        show_statistics=userInfo.get("show_statistics"),
        access_token=token,
    )
