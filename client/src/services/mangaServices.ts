import axiosInstance from "../hooks/useAxios";
import { MangaSearchResultZ } from "../schemas/searchSchemas";
import type { FilterPayload } from "../types/filterTypes";
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