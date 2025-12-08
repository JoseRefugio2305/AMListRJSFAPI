import type { TipoAnimeEnum } from "./animeTypes"
import type { TipoMangaEnum } from "./mangaTypes"

enum EmisionEnum {
     finalizado = 0,
     emision = 1,
     pausado = 2,
     todos = 3,
}

export enum StatusViewEnum {
     viendo = 1,
     pendiente = 2,
     considerando = 3,
     abandonado = 4,
     ninguno = 5,
}
enum TipoContenidoEnum {
     anime = 1,
     manga = 2,
     todos = 3,
}

enum FieldOrdEnum {
     key = "key",
     id_mal = "id_MAL",
     titulo = "titulo",
     calificacion = "calificacion",
     episodios = "episodios",
     capitulos = "capitulos"
}


enum OrderByEnum {
     asc = 1,
     desc = -1
}

export interface FilterPayload {
     limit: number
     page: number
     emision?: EmisionEnum
     onlyFavs?: boolean
     statusView?: StatusViewEnum
     tiposAnime?: [TipoAnimeEnum]
     tiposManga?: [TipoMangaEnum]
     tituloBusq?: string
     animeEstudios?: [number]
     mangaEditoriales?: [number]
     mangaAutores?: [number]
     generos?: [number]
     tipoContenido?: TipoContenidoEnum
     orderBy?: OrderByEnum
     orderByField?: FieldOrdEnum
}