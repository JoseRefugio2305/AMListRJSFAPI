import type { DataTableFilterMeta } from "primereact/datatable"
import type { TipoMangaEnum } from "./mangaTypes"
import { FilterMatchMode } from "primereact/api"
import type { TipoAnimeEnum } from "./animeTypes"

export interface OptionsSelectInterface {
     code: number,
     name: string
}

export interface OptionsSelectStrInterface {
     code: string,
     name: string
}
export const EmisionEnum = {
     finalizado: 0,
     emision: 1,
     pausado: 2,
     todos: 3,
} as const

export type EmisionEnum = typeof EmisionEnum[keyof typeof EmisionEnum];

export const TipoGSAEEnum = {
     generos: 1,
     estudios: 2,
     editoriales: 3,
     autores: 4
} as const
export type TipoGSAEEnum = typeof TipoGSAEEnum[keyof typeof TipoGSAEEnum];

export const optionsEmision: OptionsSelectInterface[] = [
     { code: EmisionEnum.emision, name: "Emisión/Publicación" },
     { code: EmisionEnum.finalizado, name: "Finalizado" },
     { code: EmisionEnum.pausado, name: "Pausado" },
     { code: EmisionEnum.todos, name: "Todos" },
]

export const StatusViewEnum = {
     viendo: 1,
     pendiente: 2,
     considerando: 3,
     abandonado: 4,
     ninguno: 5,
     completado: 6
} as const
export type StatusViewEnum = typeof StatusViewEnum[keyof typeof StatusViewEnum];

export const optionsStatusView: OptionsSelectInterface[] = [
     { code: StatusViewEnum.ninguno, name: "Todos" },
     { code: StatusViewEnum.viendo, name: "Viendo" },
     { code: StatusViewEnum.completado, name: "Completado" },
     { code: StatusViewEnum.pendiente, name: "Pendiente" },
     { code: StatusViewEnum.considerando, name: "Considerando" },
     { code: StatusViewEnum.abandonado, name: "Abandonado" },
]

export const TipoContenidoEnum = {
     anime: 1,
     manga: 2,
     todos: 3,
} as const
export type TipoContenidoEnum = typeof TipoContenidoEnum[keyof typeof TipoContenidoEnum];


export const optionsTipoCont: OptionsSelectInterface[] = [
     { code: TipoContenidoEnum.anime, name: "Anime" },
     { code: TipoContenidoEnum.manga, name: "Manga" },
     { code: TipoContenidoEnum.todos, name: "Todos" },
]

export const FieldOrdEnum = {
     key: "key",
     id_MAL: "id_MAL",
     titulo: "titulo",
     calificacion: "calificacion",
     episodios: "episodios",
     capitulos: "capitulos"
} as const
export type FieldOrdEnum = typeof FieldOrdEnum[keyof typeof FieldOrdEnum];

export const FieldOrdGSAEEnum = {
     id_MAL: "id_MAL",
     nombre: "nombre",
     nombre_mal: "nombre_mal",
} as const
export type FieldOrdGSAEEnum = typeof FieldOrdGSAEEnum[keyof typeof FieldOrdGSAEEnum];

export const optionsFieldOrd: OptionsSelectStrInterface[] = [
     { code: FieldOrdEnum.key, name: "Key" },
     { code: FieldOrdEnum.id_MAL, name: "ID MAL" },
     { code: FieldOrdEnum.titulo, name: "Título" },
     { code: FieldOrdEnum.calificacion, name: "Calificación" },
     { code: FieldOrdEnum.episodios, name: "Episodios" },
     { code: FieldOrdEnum.capitulos, name: "Capítulos" }
]

export const OrderByEnum = {
     asc: 1,
     desc: -1
} as const
export type OrderByEnum = typeof OrderByEnum[keyof typeof OrderByEnum];

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

export interface FilterGSAEPayload {
     limit: number;
     page: number;
     txtSearch: string;
     orderBy: OrderByEnum;
     orderField: FieldOrdGSAEEnum;
}

export interface FilterParamsInterface {
     tit_search: string;
     generos: number[];
     estudios: number[];
     editoriales: number[];
     autores: number[];
     emision: EmisionEnum;
     tiposAnime: TipoAnimeEnum[];
     tiposManga: TipoMangaEnum[];
     tipoContenido: TipoContenidoEnum;
     orderBy: OrderByType;
     orderField: FieldOrdEnum;
     statusView?: StatusViewEnum
}


export const ReadyToMALEnum = {
     no_listo: 0,
     listo: 1,
     todos: 2
} as const
export type ReadyToMALEnum = typeof ReadyToMALEnum[keyof typeof ReadyToMALEnum];

export const optionsReadyToMAL: OptionsSelectInterface[] = [
     { code: ReadyToMALEnum.no_listo, name: "No Listo" },
     { code: ReadyToMALEnum.listo, name: "Listo" },
     { code: ReadyToMALEnum.todos, name: "Todos" },
]


export interface LazyTableStateInc {
     first: number;
     rows: number;
     page: number;
     sortField?: string | null;
     sortOrder?: 1 | -1 | 0 | null;
     filters: DataTableFilterMeta;
}

export const lazyStateInicial: LazyTableStateInc = {
     first: 0,
     rows: 20,
     page: 0,
     sortField: "key",
     sortOrder: 1,
     filters: {
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          tipo: { value: null, matchMode: FilterMatchMode.IN },
          status: { value: null, matchMode: FilterMatchMode.IN },
     },
};