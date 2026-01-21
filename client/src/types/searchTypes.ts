import type { AnimeIncSResultSchema, AnimeSearchResultSchema, MangaIncSResultSchema, MangaSearchResultSchema, ResponseSearchAnimeMALSchema, ResponseSearchMangaMALSchema } from "../schemas/searchSchemas"

export interface AnimeSearchResult {
     is_success: boolean
     msg: string
     listaAnimes?: AnimeSearchResultSchema["listaAnimes"]
     totalAnimes?: AnimeSearchResultSchema["totalAnimes"]
     pageA?: AnimeSearchResultSchema["pageA"]
     totalPagesA?: AnimeSearchResultSchema["totalPagesA"]
}

export interface MangaSearchResult {
     is_success: boolean
     msg: string
     listaMangas?: MangaSearchResultSchema["listaMangas"]
     totalMangas?: MangaSearchResultSchema["totalMangas"]
     pageM?: MangaSearchResultSchema["pageM"]
     totalPagesM?: MangaSearchResultSchema["totalPagesM"]
}

export interface AdvancedSearchResult {
     is_success: boolean
     msg: string
     listaAnimes?: AnimeSearchResultSchema["listaAnimes"]
     totalAnimes?: AnimeSearchResultSchema["totalAnimes"]
     pageA?: AnimeSearchResultSchema["pageA"]
     totalPagesA?: AnimeSearchResultSchema["totalPagesA"]
     listaMangas?: MangaSearchResultSchema["listaMangas"]
     totalMangas?: MangaSearchResultSchema["totalMangas"]
     pageM?: MangaSearchResultSchema["pageM"]
     totalPagesM?: MangaSearchResultSchema["totalPagesM"]
}

export interface AnimeIncSearchResult {
     is_success: boolean
     msg: string
     listaAnimes?: AnimeIncSResultSchema["listaAnimes"]
     totalAnimes?: AnimeIncSResultSchema["totalAnimes"]
     pageA?: AnimeIncSResultSchema["page"]
     totalPagesA?: AnimeIncSResultSchema["totalPages"]
}

export interface MangaIncSearchResult {
     is_success: boolean
     msg: string
     listaMangas?: MangaIncSResultSchema["listaMangas"]
     totalMangas?: MangaIncSResultSchema["totalMangas"]
     pageA?: MangaIncSResultSchema["page"]
     totalPagesA?: MangaIncSResultSchema["totalPages"]
}

export interface ResponseSearchAnimeMAL {
     is_success: boolean
     msg: string
     listaAnimes?: ResponseSearchAnimeMALSchema["listaAnimes"]
     totalResults?: ResponseSearchAnimeMALSchema["totalResults"]
}

export interface ResponseSearchMangaMAL {
     is_success: boolean
     msg: string
     listaMangas?: ResponseSearchMangaMALSchema["listaMangas"]
     totalResults?: ResponseSearchMangaMALSchema["totalResults"]
}