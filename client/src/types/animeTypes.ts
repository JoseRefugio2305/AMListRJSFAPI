import type { MangaImages } from "./mangaTypes"

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
     generos?: {
          id_MAL: number
          nombre: string
     }
     id_MAL: number
     linkMAL: string
     link_p: string
     numRatings: number
     relaciones?: {
          titulo: string
          id_MAL: number
          type_rel?: string
          key_anime: number
          animeImages: AnimeImages
     }
     adaptaciones?: {
          titulo: string
          id_MAL: number
          type_rel?: string
          key_manga: number
          mangaImages: MangaImages
     }
     studios?: {
          nombre: string
          id_MAL: number
     }
     titulos_alt?: {
          titulo_alt: string
          tipo: string
     }
     isFav?: boolean
     statusView?: number
}