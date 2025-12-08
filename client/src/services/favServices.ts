import axiosInstance from "../hooks/useAxios";
import type { FavPayload, FavResponse } from "../types/favoritesTypes";

export async function changeFavStatus(ruta: string, payload: FavPayload): Promise<FavResponse> {


     const response: FavResponse = await axiosInstance.post(ruta, payload)
          .then((resp) => {
               return {
                    is_success: true,
                    msg: resp.data.active ? "Agregado a favoritos" : "Eliminado de favoritos",
                    active: resp.data.active,
                    statusView: resp.data.statusView,
               }
          }).catch((error) => {
               console.log(error)
               return {
                    is_success: false,
                    msg: "Ocurrió un error al intentar agregar a favoritos."
               }
          })

     return response
}