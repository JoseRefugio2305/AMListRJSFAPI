import axiosInstance from "../hooks/useAxios";
import { ResponseUpdCrtAnimeZ } from "../schemas/animeSchemas";
import type { MangaCreateSchema, MangaUpdateSchema } from "../schemas/mangaSchemas";
import type { PayloadIDMAL, ResponseUpdCrtAnime } from "../types/animeTypes";
import { getMessageError } from "../utils/parse_error";

export async function createManga(payload: MangaCreateSchema): Promise<ResponseUpdCrtAnime> {

     const response: ResponseUpdCrtAnime = await axiosInstance.post("/dashboard/manga/create", payload)
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

export async function asignMangaIDMAL(payload: PayloadIDMAL): Promise<ResponseUpdCrtAnime> {
     const response: ResponseUpdCrtAnime = await axiosInstance.post("/dashboard/manga/assign_id_mal/", payload)
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

export async function deleteManga(mangaId: string): Promise<ResponseUpdCrtAnime> {
     const response: ResponseUpdCrtAnime = await axiosInstance.delete(`/dashboard/manga/delete/${mangaId}`)
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

export async function updateAllMangas(): Promise<ResponseUpdCrtAnime> {
     const response: ResponseUpdCrtAnime = await axiosInstance.get("/dashboard/manga/update_all_to_mal/")
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

export async function updateManga(payload: MangaUpdateSchema, mangaId: string): Promise<ResponseUpdCrtAnime> {
     const response: ResponseUpdCrtAnime = await axiosInstance.put(`/dashboard/manga/update/${mangaId}`, payload)
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

export async function updateMangaFromMAL(mangaId: string): Promise<ResponseUpdCrtAnime> {
     const response: ResponseUpdCrtAnime = await axiosInstance.get(`/dashboard/manga/update_from_mal/${mangaId}`)
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