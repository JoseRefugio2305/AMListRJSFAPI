import type { MangaCompleteSchema } from "../schemas/mangaSchemas"


export enum TipoMangaEnum {
     Manga = 1,
     NL = 2,
     Manhwa = 3,
     Manhua = 4,
     One_Shot = 5,
     Desconocido = 6,
}


export interface MangaResult {
     is_success: boolean
     msg: string
     manga?: MangaCompleteSchema
}