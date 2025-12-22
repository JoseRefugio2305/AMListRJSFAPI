import type { FavRespSchema } from "../schemas/favoritesSchema"
import type { StatusViewEnum } from "./filterTypes"

export interface FavPayload {
     animeId?: string
     mangaId?: string
     active: boolean
     statusView: StatusViewEnum
}

export interface FavResponse {
     is_success: boolean
     msg: string
     active?: FavRespSchema["active"]
     statusView?: FavRespSchema["statusView"]
}