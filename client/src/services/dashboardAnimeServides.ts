import axiosInstance from "../hooks/useAxios";
import { ResponseUpdAllMALZ, ResponseUpdCrtAnimeZ, type AnimeCreateSchema, type AnimeFileSchema, type AnimeUpdateSchema } from "../schemas/animeSchemas";
import type { PayloadIDMAL, ResponseUpdAllMAL, ResponseUpdCrtAnime } from "../types/animeTypes";
import { getMessageError } from "../utils/parse_error";

export async function createAnime(payload: AnimeCreateSchema): Promise<ResponseUpdCrtAnime> {

     const response: ResponseUpdCrtAnime = await axiosInstance.post("/dashboard/anime/create", payload)
          .then((resp) => {
               const parsed = ResponseUpdCrtAnimeZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.")
                    return { is_success: false, msg: "Datos invalidos desde el servidor." };
               }
               return {
                    is_success: true,
                    ...resp.data
               }
          })
          .catch((error) => {
               console.error(error)
               return {
                    message: getMessageError(error),
                    is_success: false,
               }
          })


     return response
}

export async function uploadFileAnimes(payload: AnimeFileSchema): Promise<ResponseUpdAllMAL> {
     const response: ResponseUpdAllMAL = await axiosInstance.post("dashboard/anime/upload_file/", payload, { headers: { 'Content-Type': 'multipart/form-data' } })
          .then((resp) => {
               const parsed = ResponseUpdAllMALZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.")
                    return { is_success: false, message: "Datos invalidos desde el servidor." };
               }
               return {
                    is_success: true,
                    ...resp.data
               }
          }).catch((error) => {
               console.error(error)
               return {
                    is_success: false,
                    message: getMessageError(error),
               }
          })

     return response
}

export async function asignAnimeIDMAL(payload: PayloadIDMAL): Promise<ResponseUpdCrtAnime> {
     const response: ResponseUpdCrtAnime = await axiosInstance.post("/dashboard/anime/assign_id_mal/", payload)
          .then((resp) => {
               const parsed = ResponseUpdCrtAnimeZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.")
                    return { is_success: false, message: "Datos invalidos desde el servidor." };
               }
               return {
                    is_success: true,
                    ...resp.data
               }
          })
          .catch((error) => {
               console.error(error)
               return {
                    message: getMessageError(error),
                    is_success: false,
               }
          })


     return response
}

export async function updateAllAnimes(): Promise<ResponseUpdCrtAnime> {
     const response: ResponseUpdCrtAnime = await axiosInstance.get("/dashboard/anime/update_all_to_mal/")
          .then((resp) => {
               const parsed = ResponseUpdCrtAnimeZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.")
                    return { is_success: false, message: "Datos invalidos desde el servidor." };
               }
               return {
                    is_success: true,
                    ...resp.data
               }
          })
          .catch((error) => {
               console.error(error)
               return {
                    message: getMessageError(error),
                    is_success: false,
               }
          })


     return response
}

export async function deleteAnime(animeId: string): Promise<ResponseUpdCrtAnime> {
     const response: ResponseUpdCrtAnime = await axiosInstance.delete(`/dashboard/anime/delete/${animeId}`)
          .then((resp) => {
               const parsed = ResponseUpdCrtAnimeZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.")
                    return { is_success: false, message: "Datos invalidos desde el servidor." };
               }
               return {
                    is_success: true,
                    ...resp.data
               }
          })
          .catch((error) => {
               console.error(error)
               return {
                    message: getMessageError(error),
                    is_success: false,
               }
          })


     return response
}

export async function updateAnime(payload: AnimeUpdateSchema, animeId: string): Promise<ResponseUpdCrtAnime> {
     const response: ResponseUpdCrtAnime = await axiosInstance.put(`/dashboard/anime/update/${animeId}`, payload)
          .then((resp) => {
               const parsed = ResponseUpdCrtAnimeZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.")
                    return { is_success: false, msg: "Datos invalidos desde el servidor." };
               }
               return {
                    is_success: true,
                    ...resp.data
               }
          })
          .catch((error) => {
               console.error(error)
               return {
                    message: getMessageError(error),
                    is_success: false,
               }
          })


     return response
}