import axiosInstance from "../hooks/useAxios";
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