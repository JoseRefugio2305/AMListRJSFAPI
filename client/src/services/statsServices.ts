import axiosInstance from "../hooks/useAxios";
import { FavsCountZ, FullStatsZ, type FavsCountSchema, type FullStatsSchema } from "../schemas/statsSchemas";
import type { TypeStatsEnum } from "../types/statsTypes";

export async function getFavsStats(statsType: TypeStatsEnum, username: string): Promise<FavsCountSchema> {
     const response: FavsCountSchema = await axiosInstance.get(`user/stats/${username}?tipoStats=${statsType}`)
          .then((resp) => {
               const parsed = FavsCountZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return FavsCountZ.parse({});
               }
               return { ...parsed.data };
          }).catch((error) => {
               console.error(error)
               return FavsCountZ.parse({});
          })

     return response
}

export async function getFullStatsDash(statsType: TypeStatsEnum): Promise<FullStatsSchema> {
     const response: FullStatsSchema = await axiosInstance.get(`dashboard/stats/?tipoStats=${statsType}`)
          .then((resp) => {
               const parsed = FullStatsZ.safeParse(resp.data)
               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.");
                    return FullStatsZ.parse({});
               }
               return { ...parsed.data };
          }).catch((error) => {
               console.error(error)
               return FullStatsZ.parse({});
          })

     return response
}