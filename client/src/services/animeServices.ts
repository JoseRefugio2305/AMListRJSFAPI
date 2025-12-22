import axiosInstance from "../hooks/useAxios";
import { AnimeCompleteZ } from "../schemas/animeSchemas";
import { AnimeSearchResultZ } from "../schemas/searchSchemas";
import type { AnimeResult } from "../types/animeTypes";
import type { FilterPayload } from "../types/filterTypes";
import type { AnimeSearchResult } from "../types/searchTypes";
import { getMessageError } from "../utils/parse_error";

export async function getAnimes(ruta: string, payload: FilterPayload): Promise<AnimeSearchResult> {
     const response: AnimeSearchResult = await axiosInstance.post(ruta, payload)
          .then((resp) => {
               const parsed = AnimeSearchResultZ.safeParse(resp.data)

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

export async function getAnimeDetails(key_anime: number): Promise<AnimeResult> {
     const response: AnimeResult = await axiosInstance.get(`/anime/${key_anime}`)
          .then((resp) => {
               const parsed = AnimeCompleteZ.safeParse(resp.data);
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.")
                    return { is_success: false, msg: "Datos invalidos desde el servidor." };
               }
               return {
                    is_success: true,
                    msg: "Anime encontrado",
                    anime: parsed.data
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