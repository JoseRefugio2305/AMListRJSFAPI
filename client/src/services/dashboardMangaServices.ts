import axiosInstance from "../hooks/useAxios";
import { ResponseUpdCrtAnimeZ } from "../schemas/animeSchemas";
import type { MangaCreateSchema } from "../schemas/mangaSchemas";
import type { ResponseUpdCrtAnime } from "../types/animeTypes";
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