import type { MangaRelAdp } from "./mangaTypes"

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

export interface AnimeImages {
     img_sm: string
     img: string
     img_l: string
}

export interface AnimeRelAdp {
     titulo: string
     id_MAL: number
     key_anime: number
     animeImages: AnimeImages
}


export interface AnimeFullRelation {
     type_rel: string,
     animes: [AnimeRelAdp] | []
}

export interface Anime {
     id: string
     key_anime: number
     titulo: string
     tipo: TipoAnimeEnum
     animeImages: AnimeImages
     calificacion: number
     descripcion: string
     emision: number
     episodios: number
     fechaAdicion: string
     fechaEmision: string

     id_MAL: number
     linkMAL: string
     link_p: string
     numRatings: number

     isFav: boolean
}

export interface AnimeComplete extends Anime {
     generos: [{
          id_MAL: number
          nombre: string
     }] | []
     relaciones: [AnimeFullRelation] | []
     adaptaciones: [MangaRelAdp] | []
     studios: [{
          nombre: string
          id_MAL: number
     }] | []
     titulos_alt: [{
          tit_alt: string
          tipo: string
     }] | []
     statusView: StatusViewEnum | null
}

export interface AnimeResult {
     is_success: boolean
     msg: string
     anime?: AnimeComplete
}