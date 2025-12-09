import axiosInstance from "../hooks/useAxios";
import type { FilterPayload } from "../types/filterTypes";
import type { MangaSearchResult } from "../types/searchTypes";
import { getMessageError } from "../utils/parse_error";

export async function getMangas(ruta: string, payload: FilterPayload): Promise<MangaSearchResult> {
     const response: MangaSearchResult = await axiosInstance.post(ruta, payload)
          .then((resp) => {
               return {
                    msg: "OK",
                    is_success: true,
                    listaMangas: resp.data.listaMangas,
                    pageM: resp.data.pageM,
                    totalMangas: resp.data.totalMangas,
                    totalPagesM: resp.data.totalPagesM
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