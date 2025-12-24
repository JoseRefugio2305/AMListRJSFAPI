import axiosInstance from "../hooks/useAxios";
import { MangaCompleteZ } from "../schemas/mangaSchemas";
import { MangaSearchResultZ } from "../schemas/searchSchemas";
import type { FilterPayload } from "../types/filterTypes";
import type { MangaResult } from "../types/mangaTypes";
import type { MangaSearchResult } from "../types/searchTypes";
import { getMessageError } from "../utils/parse_error";

export async function getMangas(ruta: string, payload: FilterPayload): Promise<MangaSearchResult> {
     const response: MangaSearchResult = await axiosInstance.post(ruta, payload)
          .then((resp) => {
               const parsed = MangaSearchResultZ.safeParse(resp.data)

               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.")
                    return { is_success: false, msg: "Datos invalidos desde el servidor." };
               }
               return {
                    is_success: true,
                    msg: "OK",
                    ...parsed.data,
               };
          })
          .catch(error => {
               console.error(error)
               return {
                    msg: getMessageError(error),
                    is_success: false,
               }
          })
     return response;
}

export async function getMangaDetails(key_manga: number): Promise<MangaResult> {
     const response: MangaResult = await axiosInstance.get(`/manga/${key_manga}`)
          .then((resp) => {
               const parsed = MangaCompleteZ.safeParse(resp.data);
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.")
                    return { is_success: false, msg: "Datos invalidos desde el servidor." };
               }
               return {
                    is_success: true,
                    msg: "Manga encontrado",
                    manga: parsed.data
               }
          }).catch(error => {
               console.error(error)
               return {
                    msg: getMessageError(error),
                    is_success: false,
               }
          });
     return response;
}