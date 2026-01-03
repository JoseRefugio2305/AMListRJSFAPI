import type { TipoAnimeEnum } from "./animeTypes"
import type { TipoMangaEnum } from "./mangaTypes"

export interface OptionsSelectInterface {
     code: number,
     name: string
}

export interface OptionsSelectStrInterface {
     code: string,
     name: string
}
export enum EmisionEnum {
     finalizado = 0,
     emision = 1,
     pausado = 2,
     todos = 3,
}
export const optionsEmision: OptionsSelectInterface[] = [
     { code: EmisionEnum.emision, name: "Emisión/Publicación" },
     { code: EmisionEnum.finalizado, name: "Finalizado" },
     { code: EmisionEnum.pausado, name: "Pausado" },
     { code: EmisionEnum.todos, name: "Todos" },
]

export enum StatusViewEnum {
     viendo = 1,
     pendiente = 2,
     considerando = 3,
     abandonado = 4,
     ninguno = 5,
}
export enum TipoContenidoEnum {
     anime = 1,
     manga = 2,
     todos = 3,
}

export const optionsTipoCont: OptionsSelectInterface[] = [
     { code: TipoContenidoEnum.anime, name: "Anime" },
     { code: TipoContenidoEnum.manga, name: "Manga" },
     { code: TipoContenidoEnum.todos, name: "Todos" },
]

export enum FieldOrdEnum {
     key = "key",
     id_mal = "id_MAL",
     titulo = "titulo",
     calificacion = "calificacion",
     episodios = "episodios",
     capitulos = "capitulos"
}

export const optionsFieldOrd: OptionsSelectStrInterface[] = [
     { code: FieldOrdEnum.key, name: "Key" },
     { code: FieldOrdEnum.id_mal, name: "ID MAL" },
     { code: FieldOrdEnum.titulo, name: "Título" },
     { code: FieldOrdEnum.calificacion, name: "Calificación" },
     { code: FieldOrdEnum.episodios, name: "Episodios" },
     { code: FieldOrdEnum.capitulos, name: "Capítulos" }
]

export enum OrderByEnum {
     asc = 1,
     desc = -1
}

export const optionsOrderBy: OptionsSelectStrInterface[] = [
     { code: "asc", name: "Ascendente" },
     { code: "desc", name: "Descendente" },
]

export type OrderByType = "asc" | "desc"

export interface FilterPayload {
     limit: number
     page: number
     emision?: EmisionEnum
     onlyFavs?: boolean
     statusView?: StatusViewEnum
     tiposAnime?: TipoAnimeEnum[]
     tiposManga?: TipoMangaEnum[]
     tituloBusq?: string
     animeEstudios?: number[]
     mangaEditoriales?: number[]
     mangaAutores?: number[]
     generos?: number[]
     tipoContenido?: TipoContenidoEnum
     orderBy?: OrderByEnum
     orderField?: FieldOrdEnum
}

export interface FilterParamsInterface {
     tit_search: string;
     generos: number[];
     estudios: number[];
     editoriales: number[];
     autores: number[];
     emision: number;
     tiposAnime: number[];
     tiposManga: number[];
     tipoContenido: number;
     orderBy: OrderByType;
     orderField: FieldOrdEnum;

}
