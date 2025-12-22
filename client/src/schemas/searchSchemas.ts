import * as z from "zod";
import { AnimeZ } from "./animeSchemas";
import { MangaZ } from "./mangaSchemas";


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

//Exports de tipos
export type AnimeSearchResultSchema = z.infer<typeof AnimeSearchResultZ>

export type MangaSearchResultSchema = z.infer<typeof MangaSearchResultZ>