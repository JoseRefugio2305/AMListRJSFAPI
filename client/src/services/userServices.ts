import axiosInstance from "../hooks/useAxios";
import { AnimeSearchResultZ, MangaSearchResultZ, type AnimeSearchResultSchema, type MangaSearchResultSchema } from "../schemas/searchSchemas";
import { ResponseProfPicZ, RespPayCngEmailZ, RespPayCngUsernameZ, UserProfileZ, type UserProfileSchema } from "../schemas/userSchemas";
import type { FilterPayload } from "../types/filterTypes";
import type { PayloadEmail, PayloadProfPic, PayloadUsername, ResponseEmail, ResponseProfPic, ResponseUsername } from "../types/userTypes";
import { getMessageError } from "../utils/parse_error";

export async function getUserDataProfile(username: string, isConfig: boolean = false): Promise<UserProfileSchema> {
     const response: UserProfileSchema = await axiosInstance.get(isConfig ? "/user/me/" : `/user/${username}`)
          .then((resp) => {
               const parsed = UserProfileZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return UserProfileZ.parse({});
               }
               return { ...parsed.data };
          }).catch(error => {
               console.error(error);
               return UserProfileZ.parse({});
          })

     return response
}

export async function getUserAnimeList(username: string, filterPayload: FilterPayload): Promise<AnimeSearchResultSchema> {
     const response: AnimeSearchResultSchema = await axiosInstance.post(`/user/anime_list/${username}`, filterPayload)
          .then((resp) => {
               const parsed = AnimeSearchResultZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return AnimeSearchResultZ.parse({});
               }
               return { ...parsed.data };
          }).catch(error => {
               console.error(error);
               return AnimeSearchResultZ.parse({});
          })

     return response
}

export async function getUserMangaList(username: string, filterPayload: FilterPayload): Promise<MangaSearchResultSchema> {
     const response: MangaSearchResultSchema = await axiosInstance.post(`/user/manga_list/${username}`, filterPayload)
          .then((resp) => {
               const parsed = MangaSearchResultZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return MangaSearchResultZ.parse({});
               }
               return { ...parsed.data };
          }).catch(error => {
               console.error(error);
               return MangaSearchResultZ.parse({});
          })

     return response
}

export async function changeProfilePic(payload: PayloadProfPic): Promise<ResponseProfPic> {
     const response: ResponseProfPic = await axiosInstance.post("/user/change_profpic/", payload)
          .then((resp) => {
               const parsed = ResponseProfPicZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return {
                         is_success: false,
                         msg: "Datos invalidos desde el servidor."
                    };
               }
               return {
                    is_success: true,
                    msg: "Se cambio el avatar de perfil.",
                    ...parsed.data
               };
          }).catch((error) => {
               return {
                    is_success: false,
                    msg: getMessageError(error)
               }
          })

     return response
}

export async function changeUsernane(payload: PayloadUsername): Promise<ResponseUsername> {
     const response: ResponseUsername = await axiosInstance.post("/user/change_username/", payload)
          .then((resp) => {
               const parsed = RespPayCngUsernameZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return {
                         is_success: false,
                         msg: "Datos invalidos desde el servidor."
                    };
               }
               return {
                    is_success: true,
                    msg: "Se cambio el nombre de perfil.",
                    ...parsed.data
               };
          }).catch((error) => {
               return {
                    is_success: false,
                    msg: getMessageError(error)
               }
          })

     return response
}

export async function changeEmail(payload: PayloadEmail): Promise<ResponseEmail> {
     const response: ResponseEmail = await axiosInstance.post("/user/change_email/", payload)
          .then((resp) => {
               const parsed = RespPayCngEmailZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return {
                         is_success: false,
                         msg: "Datos invalidos desde el servidor."
                    };
               }
               return {
                    is_success: true,
                    msg: "Se cambio el email de usuario.",
                    ...parsed.data
               };
          }).catch((error) => {
               return {
                    is_success: false,
                    msg: getMessageError(error)
               }
          })

     return response
}