import * as z from "zod";
import { AnimeIncompleteZ, AnimeMALSearchZ, AnimeZ } from "./animeSchemas";
import { MangaIncompleteZ, MangaZ } from "./mangaSchemas";


export const AnimeSearchResultZ = z.object({
     listaAnimes: z.array(AnimeZ).default([]),
     pageA: z.number().optional(),
     totalAnimes: z.number().optional(),
     totalPagesA: z.number().optional(),
});

export const MangaSearchResultZ = z.object({
     listaMangas: z.array(MangaZ).default([]),
     pageM: z.number().optional(),
     totalMangas: z.number().optional(),
     totalPagesM: z.number().optional(),
});

export const AdvancedSearchResultZ = AnimeSearchResultZ.and(MangaSearchResultZ);

export const AnimeIncSResultZ = z.object({
     listaAnimes: z.array(AnimeIncompleteZ).default([]),
     page: z.number().optional(),
     totalAnimes: z.number().optional(),
     totalPages: z.number().optional(),
})

export const MangaIncSResultZ = z.object({
     listaMangas: z.array(MangaIncompleteZ).default([]),
     page: z.number().optional(),
     totalMangas: z.number().optional(),
     totalPages: z.number().optional(),
})

export const SearchOnMALZ = z.object({
     tit_search: z.string().min(4)
})

export const ResponseSearchAnimeMALZ = z.object({
     listaAnimes: z.array(AnimeMALSearchZ).default([]),
     totalResults: z.number().default(0)
})

export const ResponseSearchMangaMALZ = z.object({
     listaMangas: z.array(AnimeMALSearchZ).default([]),
     totalResults: z.number().default(0)
})

//Exports de tipos
export type AnimeSearchResultSchema = z.infer<typeof AnimeSearchResultZ>

export type MangaSearchResultSchema = z.infer<typeof MangaSearchResultZ>
export type AnimeIncSResultSchema = z.infer<typeof AnimeIncSResultZ>
export type MangaIncSResultSchema = z.infer<typeof MangaIncSResultZ>
export type SearchOnMALSchema = z.infer<typeof SearchOnMALZ>
export type ResponseSearchAnimeMALSchema = z.infer<typeof ResponseSearchAnimeMALZ>
export type ResponseSearchMangaMALSchema = z.infer<typeof ResponseSearchMangaMALZ>