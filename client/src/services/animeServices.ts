import axiosInstance from "../hooks/useAxios";
import type { AnimeResult } from "../types/animeTypes";
import type { FilterPayload } from "../types/filterTypes";
import type { AnimeSearchResult } from "../types/searchTypes";
import { getMessageError } from "../utils/parse_error";

export async function getAnimes(ruta: string, payload: FilterPayload): Promise<AnimeSearchResult> {
     const response: AnimeSearchResult = await axiosInstance.post(ruta, payload)
          .then((resp) => {
               return {
                    msg: "OK",
                    is_success: true,
                    listaAnimes: resp.data.listaAnimes,
                    pageA: resp.data.pageA,
                    totalAnimes: resp.data.totalAnimes,
                    totalPagesA: resp.data.totalPagesA
               }
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
     const response = await axiosInstance.get(`/anime/${key_anime}`)
          .then((resp) => {
               return {
                    is_success: true,
                    msg: "Anime encontrado",
                    anime: resp.data
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