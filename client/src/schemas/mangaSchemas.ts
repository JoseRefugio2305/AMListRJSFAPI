import * as z from "zod";
import { TipoMangaEnum } from "../types/mangaTypes";
import { MangaRelAdpZ, MangaImagesSharedZ, MangaFullRelationZ, AnimeRelAdpZ, StatusViewZ } from "./relationsSchemas";

export const TipoMangaZ = z.enum(TipoMangaEnum);

export const MangaImagesZ = MangaImagesSharedZ;

export { MangaRelAdpZ, MangaFullRelationZ, AnimeRelAdpZ };

export const MangaZ = z.object({
     id: z.string(),
     key_manga: z.number(),
     titulo: z.string(),
     link_p: z.url(),
     tipo: TipoMangaZ,
     mangaImages: MangaImagesZ,
     calificacion: z.number(),
     descripcion: z.string(),
     publicando: z.number(),
     capitulos: z.number(),
     volumenes: z.number(),
     fechaAdicion: z.string(),
     fechaComienzoPub: z.string(),
     fechaFinPub: z.string().optional(),
     id_MAL: z.number(),
     linkMAL: z.url(),
     numRatings: z.number(),
     isFav: z.boolean().optional().default(false),
});

export const MangaCompleteZ =MangaZ.extend({
     generos: z.array(z.object({ id_MAL: z.number(), nombre: z.string() })).default([]),
     relaciones: z.array(MangaFullRelationZ).default([]),
     adaptaciones: z.array(AnimeRelAdpZ).default([]),
     editoriales: z.array(z.object({ nombre: z.string(), id_MAL: z.number() })).default([]),
     autores: z.array(z.object({ nombre: z.string(), id_MAL: z.number() })).default([]),
     titulos_alt: z.array(z.object({ tit_alt: z.string(), tipo: z.string() })).default([]),
     statusView: StatusViewZ.nullable().optional(),
})


//Exports de tipos
export type MangaSchema = z.infer<typeof MangaZ>
export type MangaCompleteSchema = z.infer<typeof MangaCompleteZ>