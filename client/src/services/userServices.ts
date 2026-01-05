import axiosInstance from "../hooks/useAxios";
import { AnimeSearchResultZ, type AnimeSearchResultSchema } from "../schemas/searchSchemas";
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