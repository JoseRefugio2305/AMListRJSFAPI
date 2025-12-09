import type { Anime } from "./animeTypes"
import type { Manga } from "./mangaTypes"

export interface AnimeSearchResult {
     is_success: boolean
     msg: string
     listaAnimes?: [Anime]
     totalAnimes?: number
     pageA?: number
     totalPagesA?: number
}

export interface MangaSearchResult {
     is_success: boolean
     msg: string
     listaMangas?: [Manga]
     totalMangas?: number
     pageM?: number
     totalPagesM?: number
}