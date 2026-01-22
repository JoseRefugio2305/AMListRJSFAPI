import * as z from "zod";

export const GSAEZ = z.object({
     id: z.string(),
     id_MAL: z.number(),
     nombre: z.string(),
     nombre_mal: z.string().optional().default(""),
     tipo:z.string().optional().default(""),
     linkMAL: z.url(),
     fechaAdicion: z.string()
})

export type GSAESchema = z.infer<typeof GSAEZ>