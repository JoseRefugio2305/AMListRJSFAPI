import type { DataTableFilterMeta } from "primereact/datatable"
import type { LazyTableState } from "../components/Dashboard/Anime/AnimeIncompleteList"
import type { TipoAnimeEnum } from "./animeTypes"
import type { TipoMangaEnum } from "./mangaTypes"
import { FilterMatchMode } from "primereact/api"

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

export enum TipoGSAEEnum {
     generos = 1,
     estudios = 2,
     editoriales = 3,
     autores = 4
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

export const optionsStatusView: OptionsSelectInterface[] = [
     { code: StatusViewEnum.ninguno, name: "Todos" },
     { code: StatusViewEnum.viendo, name: "Viendo" },
     { code: StatusViewEnum.pendiente, name: "Pendiente" },
     { code: StatusViewEnum.considerando, name: "Considerando" },
     { code: StatusViewEnum.abandonado, name: "Abandonado" },
]

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
     id_MAL = "id_MAL",
     titulo = "titulo",
     calificacion = "calificacion",
     episodios = "episodios",
     capitulos = "capitulos"
}

export enum FieldOrdGSAEEnum {
     id_MAL = "id_MAL",
     nombre = "nombre",
     nombre_mal = "nombre_mal",
}

export const optionsFieldOrd: OptionsSelectStrInterface[] = [
     { code: FieldOrdEnum.key, name: "Key" },
     { code: FieldOrdEnum.id_MAL, name: "ID MAL" },
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
     emision: number;
     tiposAnime: number[];
     tiposManga: number[];
     tipoContenido: number;
     orderBy: OrderByType;
     orderField: FieldOrdEnum;
     statusView?: StatusViewEnum
}


export enum ReadyToMALEnum {
     no_listo = 0,
     listo = 1,
     todos = 2
}

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

export const lazyStateInicial: LazyTableState = {
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