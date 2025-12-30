import type { AnimeCompleteSchema } from "../schemas/animeSchemas";
import type { OptionsSelectInterface } from "./filterTypes";


export enum StatusViewEnum {
     Viendo = 1,  // Leyendo en manga
     Pendiente = 2,
     Considerando = 3,
     Abandonado = 4,
     Ninguno = 5
}



export enum TipoAnimeEnum {
     Anime = 1,
     OVA = 2,
     Pelicula = 3,
     Especial = 4,
     Desconocido = 5,
     Donghua = 6,
}

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

