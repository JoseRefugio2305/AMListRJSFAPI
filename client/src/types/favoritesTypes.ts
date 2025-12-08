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
     active?: boolean
     statusView?: StatusViewEnum
}