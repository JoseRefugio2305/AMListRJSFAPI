import type { AnimeCompleteSchema, ResponseUpdAllMALSchema, ResponseUpdCrtAnimeSchema } from "../schemas/animeSchemas";
import type { OptionsSelectInterface } from "./filterTypes";


export const StatusViewEnum = {
     Viendo: 1,  // Leyendo en manga
     Pendiente: 2,
     Considerando: 3,
     Abandonado: 4,
     Ninguno: 5,
     Completado: 6
} as const

export const StatusViewLabel: Record<StatusViewEnum, string> = {
     1: "Viendo",
     2: "Pendiente",
     3: "Considerando",
     4: "Abandonado",
     5: "Ninguno",
     6: "Completado"
};

export type StatusViewEnum = typeof StatusViewEnum[keyof typeof StatusViewEnum];


export const TipoAnimeEnum = {
     Anime: 1,
     OVA: 2,
     Pelicula: 3,
     Especial: 4,
     Desconocido: 5,
     Donghua: 6,
} as const

export const TipoAnimeLabel: Record<TipoAnimeEnum, string> = {
     1: "Anime",
     2: "OVA",
     3: "Pelicula",
     4: "Especial",
     5: "Desconocido",
     6: "Donghua"
};

export type TipoAnimeEnum = typeof TipoAnimeEnum[keyof typeof TipoAnimeEnum];

export const optionsTipoAnime: OptionsSelectInterface[] = [
     { code: TipoAnimeEnum.Anime, name: "Anime" },
     { code: TipoAnimeEnum.Donghua, name: "Donghua" },
     { code: TipoAnimeEnum.Especial, name: "Especial" },
     { code: TipoAnimeEnum.Pelicula, name: "Pelicula" },
     { code: TipoAnimeEnum.OVA, name: "OVA" },
]

export interface AnimeResult {
     is_success: boolean
     msg: string
     anime?: AnimeCompleteSchema
}

export interface ResponseUpdCrtAnime {
     is_success: boolean
     message: ResponseUpdCrtAnimeSchema["message"]
}

export interface ResponseUpdAllMAL {
     is_success: boolean
     message: ResponseUpdAllMALSchema["message"]
     totalToAct?: ResponseUpdAllMALSchema["totalToAct"]
     totalAct?: ResponseUpdAllMALSchema["totalAct"]
}

export interface PayloadIDMAL {
     id: string
     id_MAL: number
}