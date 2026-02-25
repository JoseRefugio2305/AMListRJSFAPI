import type { OptionsSelectInterface } from "./filterTypes";

export const TypeStatsEnum = {
     a_m_favs: 1, // Sera para conteo general en el caso del dashboard
     tipo_a_m: 2,
     generos: 3,
     studios: 4,
     editorials: 5
} as const

export type TypeStatsEnum = typeof TypeStatsEnum[keyof typeof TypeStatsEnum];

export const optionsTypeStat: OptionsSelectInterface[] = [
     { code: TypeStatsEnum.a_m_favs, name: "Estado de Visionado" },
     { code: TypeStatsEnum.tipo_a_m, name: "Tipos de Anime/Manga" },
     { code: TypeStatsEnum.generos, name: "Generos" },
     { code: TypeStatsEnum.studios, name: "Top Estudios" },
     { code: TypeStatsEnum.editorials, name: "Top Editoriales" },
]