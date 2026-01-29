import * as z from "zod";
import { StatusViewEnum } from "../types/animeTypes";

export const AnimeImagesSharedZ = z.object({
  img_sm: z.url(),
  img: z.url(),
  img_l: z.url(),
});

export const MangaImagesSharedZ = z.object({
  img_sm: z.url(),
  img: z.url(),
  img_l: z.url(),
});

export const AnimeRelAdpZ = z.object({
  titulo: z.string(),
  id_MAL: z.number(),
  key_anime: z.number(),
  animeImages: AnimeImagesSharedZ,
});

export const MangaRelAdpZ = z.object({
  titulo: z.string(),
  id_MAL: z.number(),
  key_manga: z.number(),
  mangaImages: MangaImagesSharedZ,
});

export const AnimeFullRelationZ = z.object({
  type_rel: z.string(),
  animes: z.array(AnimeRelAdpZ).default([]),
});

export const MangaFullRelationZ = z.object({
  type_rel: z.string(),
  mangas: z.array(MangaRelAdpZ).default([]),
});

export const StatusViewZ = z.enum(StatusViewEnum);

export type AnimeRelAdpSchema = z.infer<typeof AnimeRelAdpZ>;
export type MangaRelAdpSchema = z.infer<typeof MangaRelAdpZ>;
export type AnimeImagesSharedSchema = z.infer<typeof AnimeImagesSharedZ>;
