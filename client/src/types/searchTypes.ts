import type { Anime } from "./animeTypes"

export interface AnimeSearchResult {
     is_success:boolean
     msg:string
     listaAnimes?: [Anime]
     totalAnimes?: number
     pageA?: number
     totalPagesA?: number
}