import type { MangaCompleteSchema } from "../schemas/mangaSchemas"
import type { OptionsSelectInterface } from "./filterTypes"


export enum TipoMangaEnum {
     Manga = 1,
     NL = 2,
     Manhwa = 3,
     Manhua = 4,
     One_Shot = 5,
     Desconocido = 6,
}

export const optionsTipoManga: OptionsSelectInterface[] = [
     { code: TipoMangaEnum.Manga, name: "Manga" },
     { code: TipoMangaEnum.NL, name: "Novela Ligera" },
     { code: TipoMangaEnum.Manhwa, name: "Manhwa" },
     { code: TipoMangaEnum.Manhua, name: "Manhua" },
     { code: TipoMangaEnum.One_Shot, name: "One Shot" },
]

export interface MangaResult {
     is_success: boolean
     msg: string
     manga?: MangaCompleteSchema
}