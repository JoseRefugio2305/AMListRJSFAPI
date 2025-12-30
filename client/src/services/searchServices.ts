import axiosInstance from "../hooks/useAxios";
import { FiltersAdvancedSearchZ, type FiltersAdvancedSearchSchema } from "../schemas/filtersSchemas";
import { AdvancedSearchResultZ } from "../schemas/searchSchemas";
import type { FilterPayload } from "../types/filterTypes";
import type { AdvancedSearchResult } from "../types/searchTypes";
import { getMessageError } from "../utils/parse_error";

export async function getFilters(): Promise<FiltersAdvancedSearchSchema> {
     const response: FiltersAdvancedSearchSchema = await axiosInstance.get("/search/get_filters/")
          .then((resp) => {
               const parsed = FiltersAdvancedSearchZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return FiltersAdvancedSearchZ.parse({});
               }
               return { ...parsed.data };
          }).catch(error => {
               console.error(error);
               return FiltersAdvancedSearchZ.parse({});
          })

     return response;
}

export async function doAdvancedSearch(filterPayload: FilterPayload): Promise<AdvancedSearchResult> {
     const response: AdvancedSearchResult = await axiosInstance.post("/search/", filterPayload)
          .then((resp) => {
               const parsed = AdvancedSearchResultZ.safeParse(resp.data)

               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.")
                    return { is_success: false, msg: "Datos invalidos desde el servidor." };
               }
               return {
                    is_success: true,
                    msg: "OK",
                    ...parsed.data,
               };
          }).catch(error => {
               console.error(error)
               return {
                    msg: getMessageError(error),
                    is_success: false,
               }
          })

     return response;
}