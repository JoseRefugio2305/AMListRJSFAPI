import * as z from "zod";
import { StatusViewEnum, TipoAnimeEnum } from "../types/animeTypes";
import { MangaRelAdpZ } from "./mangaSchemas";


export const TipoAnimeZ = z.enum(TipoAnimeEnum);

export const StatusViewZ = z.enum(StatusViewEnum);

export const AnimeImagesZ = z.object({
     img_sm: z.string(),
     img: z.string(),
     img_l: z.string(),
});

export const AnimeRelAdpZ = z.object({
     titulo: z.string(),
     id_MAL: z.number(),
     key_anime: z.number(),
     animeImages: AnimeImagesZ,
});

export const AnimeFullRelationZ = z.object({
     type_rel: z.string(),
     animes: z.array(AnimeRelAdpZ).default([]),
});

export const AnimeZ = z.object({
     id: z.string(),
     key_anime: z.number(),
     titulo: z.string(),
     tipo: TipoAnimeZ,
     animeImages: AnimeImagesZ,
     calificacion: z.number(),
     descripcion: z.string(),
     emision: z.number(),
     episodios: z.number(),
     fechaAdicion: z.string(),
     fechaEmision: z.string(),
     id_MAL: z.number(),
     linkMAL: z.url(),
     link_p: z.url(),
     numRatings: z.number(),
     isFav: z.boolean().optional().default(false),
});

export const AnimeCompleteZ = AnimeZ.extend({
     generos: z.array(z.object({ id_MAL: z.number(), nombre: z.string() })).default([]),
     relaciones: z.array(AnimeFullRelationZ).default([]),
     adaptaciones: z.array(MangaRelAdpZ).default([]),
     studios: z.array(z.object({ nombre: z.string(), id_MAL: z.number() })).default([]),
     titulos_alt: z.array(z.object({ tit_alt: z.string(), tipo: z.string() })).default([]),
     statusView: StatusViewZ.nullable().optional(),
});

export const AnimeResultZ = z.object({
     is_success: z.boolean(),
     msg: z.string().optional(),
     anime: AnimeCompleteZ.optional(),
});

//Exports de tipos
export type AnimeSchema = z.infer<typeof AnimeZ>
export type AnimeCompleteSchema = z.infer<typeof AnimeCompleteZ>
export type AnimeRelAdpSchema = z.infer<typeof AnimeRelAdpZ>