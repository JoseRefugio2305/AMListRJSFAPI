import axiosInstance from "../hooks/useAxios";
import { FavRespZ } from "../schemas/favoritesSchema";
import type { FavPayload, FavResponse } from "../types/favoritesTypes";

export async function changeFavStatus(ruta: string, payload: FavPayload): Promise<FavResponse> {


     const response: FavResponse = await axiosInstance.post(ruta, payload)
          .then((resp) => {
               const parsed = FavRespZ.safeParse(resp.data)

               if (!parsed.success) {
                    console.error("Datos invalidos desde el servidor.")
                    return { is_success: false, msg: "Datos invalidos desde el servidor." };
               }
               return {
                    is_success: true,
                    msg: parsed.data.active ? "Agregado a favoritos" : "Eliminado de favoritos",
                    ...parsed.data,
               };
          }).catch((error) => {
               console.log(error)
               return {
                    is_success: false,
                    msg: "Ocurrió un error al intentar agregar a favoritos."
               }
          })

     return response
}