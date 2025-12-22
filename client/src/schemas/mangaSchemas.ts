import * as z from "zod";
import { TipoMangaEnum } from "../types/mangaTypes";

export const TipoMangaZ = z.enum(TipoMangaEnum);

export const MangaImagesZ = z.object({
     img_sm: z.string(),
     img: z.string(),
     img_l: z.string(),
});

export const MangaRelAdpZ = z.object({
     titulo: z.string(),
     id_MAL: z.number(),
     key_manga: z.number(),
     mangaImages: MangaImagesZ,
});

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


//Exports de tipos
export type MangaSchema = z.infer<typeof MangaZ>