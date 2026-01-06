import axiosInstance from "../hooks/useAxios";
import { AnimeSearchResultZ, MangaSearchResultZ, type AnimeSearchResultSchema, type MangaSearchResultSchema } from "../schemas/searchSchemas";
import { UserProfileZ, type UserProfileSchema } from "../schemas/userSchemas";
import type { FilterPayload } from "../types/filterTypes";

export async function getUserDataProfile(username: string): Promise<UserProfileSchema> {
     const response: UserProfileSchema = await axiosInstance.get(`/user/${username}`)
          .then((resp) => {
               const parsed = UserProfileZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return UserProfileZ.parse({});
               }
               return { ...parsed.data };
          }).catch(error => {
               console.error(error);
               return UserProfileZ.parse({});
          })

     return response
}

export async function getUserAnimeList(username: string, filterPayload: FilterPayload): Promise<AnimeSearchResultSchema> {
     const response: AnimeSearchResultSchema = await axiosInstance.post(`/user/anime_list/${username}`, filterPayload)
          .then((resp) => {
               const parsed = AnimeSearchResultZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return AnimeSearchResultZ.parse({});
               }
               return { ...parsed.data };
          }).catch(error => {
               console.error(error);
               return AnimeSearchResultZ.parse({});
          })

     return response
}

export async function getUserMangaList(username: string, filterPayload: FilterPayload): Promise<MangaSearchResultSchema> {
     const response: MangaSearchResultSchema = await axiosInstance.post(`/user/manga_list/${username}`, filterPayload)
          .then((resp) => {
               const parsed = MangaSearchResultZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return MangaSearchResultZ.parse({});
               }
               return { ...parsed.data };
          }).catch(error => {
               console.error(error);
               return MangaSearchResultZ.parse({});
          })

     return response
}