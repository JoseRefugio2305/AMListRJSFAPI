import type { AnimeCompleteSchema } from "../schemas/animeSchemas";


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

export interface AnimeResult {
     is_success: boolean
     msg: string
     anime?: AnimeCompleteSchema
}

