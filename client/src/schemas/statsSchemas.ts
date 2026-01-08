import * as z from "zod";

export const StatsTipoAMZ = z.object({
     code: z.number().default(0),
     conteo: z.number().default(0),
     nombre: z.string().default("")

})

export const StatsGeneroZ = z.object({
     id_MAL: z.number().default(0),
     nombre: z.string().default(""),
     conteomangas: z.number().default(0),
     conteoanimes: z.number().default(0)
})

export const TopStudiosZ = z.object({
     id_MAL: z.number().default(0),
     nombre: z.string().default(""),
     conteoanimes: z.number().default(0)
})

export const TopEditorialsZ = z.object({
     id_MAL: z.number().default(0),
     nombre: z.string().default(""),
     conteomangas: z.number().default(0)
})

export const StatsZ = z.object({
     tiposAnime: z.array(StatsTipoAMZ).default([]),
     tiposManga: z.array(StatsTipoAMZ).default([]),
     conteoGeneros: z.array(StatsGeneroZ).default([]),
     topStudios: z.array(TopStudiosZ).default([]),
     topEditorials: z.array(TopEditorialsZ).default([]),

})

export const FullStatsZ = StatsZ.extend({
     totalUsuarios: z.number().default(0),
     totalAnimes: z.number().default(0),
     totalMangas: z.number().default(0),
     totalAutoresMangas: z.number().default(0),
     totalStdAnime: z.number().default(0),
     totalEdtManga: z.number().default(0),
     totalGeneros: z.number().default(0),
})

export const StatusViewCountZ = z.object({
     statusView: z.number().default(0),
     conteo: z.number().default(0),
})

export const FavsCountZ = StatsZ.extend({
     totalAnimes: z.number().default(0),
     conteos_statusA: z.array(StatusViewCountZ).default([]),
     totalMangas: z.number().default(0),
     conteos_statusM: z.array(StatusViewCountZ).default([]),
})

export type FavsCountSchema = z.infer<typeof FavsCountZ>
export type StatusViewCountSchema = z.infer<typeof StatusViewCountZ>
export type FullStatsSchema = z.infer<typeof FullStatsZ>