import axiosInstance from "../hooks/useAxios";
import { FiltersAdvancedSearchZ, type FiltersAdvancedSearchSchema } from "../schemas/filtersSchemas";
import { AdvancedSearchResultZ, AnimeIncSResultZ, MangaIncSResultZ, ResponseSearchAnimeMALZ, ResponseSearchMangaMALZ, type SearchOnMALSchema } from "../schemas/searchSchemas";
import { ReadyToMALEnum, type FilterPayload } from "../types/filterTypes";
import type { AdvancedSearchResult, AnimeIncSearchResult, MangaIncSearchResult, ResponseSearchAnimeMAL, ResponseSearchMangaMAL } from "../types/searchTypes";
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

export async function getIncompleteAnimes(filterPayload: FilterPayload, tipo: ReadyToMALEnum = ReadyToMALEnum.todos): Promise<AnimeIncSearchResult> {
     const response: AnimeIncSearchResult = await axiosInstance.post(`/dashboard/anime/get_incomplete/${tipo}`, filterPayload)
          .then((resp) => {
               const parsed = AnimeIncSResultZ.safeParse(resp.data)
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

     return response
}

export async function getAnimesFromMAL(payload: SearchOnMALSchema): Promise<ResponseSearchAnimeMAL> {
     const response: ResponseSearchAnimeMAL = await axiosInstance.post("/dashboard/anime/search_on_mal/", payload)
          .then((resp) => {
               const parsed = ResponseSearchAnimeMALZ.safeParse(resp.data)
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

     return response
}

export async function getIncompleteMangas(filterPayload: FilterPayload, tipo: ReadyToMALEnum = ReadyToMALEnum.todos): Promise<MangaIncSearchResult> {
     const response: MangaIncSearchResult = await axiosInstance.post(`/dashboard/manga/get_incomplete/${tipo}`, filterPayload)
          .then((resp) => {
               const parsed = MangaIncSResultZ.safeParse(resp.data)
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

     return response
}

export async function getMangasFromMAL(payload: SearchOnMALSchema): Promise<ResponseSearchMangaMAL> {
     const response: ResponseSearchMangaMAL = await axiosInstance.post("/dashboard/manga/search_on_mal/", payload)
          .then((resp) => {
               const parsed = ResponseSearchMangaMALZ.safeParse(resp.data)
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

     return response
}
