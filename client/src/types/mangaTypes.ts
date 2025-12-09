import type { AnimeImages } from "./animeTypes"

export enum TipoMangaEnum {
     manga = 1,
     nl = 2,
     manhwa = 3,
     manhua = 4,
     one_shot = 5,
     desconocido = 6,
}

export interface MangaImages {
     img_sm: string
     img: string
     img_l: string
}

export interface Manga {
     id: string
     key_manga: number
     titulo: string
     link_p: string
     tipo: TipoMangaEnum
     mangaImages: AnimeImages
     calificacion: number
     descripcion: string
     publicando: number
     capitulos: number
     volumenes: number
     fechaAdicion: string
     fechaComienzoPub: string
     fechaFinPub?: string
     generos?: {
          id_MAL: number
          nombre: string
     }
     id_MAL: number
     linkMAL: string
     numRatings: number
     relaciones?: {
          titulo: string
          id_MAL: number
          type_rel?: string
          key_manga: number
          mangaImages: AnimeImages
     }
     adaptaciones?: {
          titulo: string
          id_MAL: number
          type_rel?: string
          key_anime: number
          animeImages: MangaImages
     }
     editoriales?: {
          nombre: string
          id_MAL: number
     }
     autores?: {
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