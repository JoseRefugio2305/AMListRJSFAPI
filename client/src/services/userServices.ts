import axiosInstance from "../hooks/useAxios";
import { UserProfileZ, type UserProfileSchema } from "../schemas/userSchemas";

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