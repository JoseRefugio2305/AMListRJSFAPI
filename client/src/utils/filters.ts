import { parseStringNumber } from "./parse";
import { EmisionEnum, FieldOrdEnum, StatusViewEnum, TipoContenidoEnum, type FilterParamsInterface } from "../types/filterTypes";
import type { TipoAnimeEnum } from "../types/animeTypes";
import type { TipoMangaEnum } from "../types/mangaTypes";

export function getInitialFilters(searchParams: URLSearchParams, tipoContenido: TipoContenidoEnum, onlyFavs: boolean = false): FilterParamsInterface {
     return {
          tit_search: searchParams.get("tit_search") || "",
          generos:
               searchParams
                    .get("genres")
                    ?.split(",")
                    .map((g) => parseStringNumber(g)) || [],
          estudios:
               searchParams
                    .get("studios")
                    ?.split(",")
                    .map((e) => parseStringNumber(e)) || [],
          editoriales:
               searchParams
                    .get("editorials")
                    ?.split(",")
                    .map((ed) => parseStringNumber(ed)) || [],
          autores:
               searchParams
                    .get("authors")
                    ?.split(",")
                    .map((a) => parseStringNumber(a)) || [],
          tiposAnime:
               (searchParams
                    .get("tiposAnime")
                    ?.split(",")
                    .map((ta) => parseStringNumber(ta)) || []) as TipoAnimeEnum[],
          tiposManga:
               (searchParams
                    .get("tiposManga")
                    ?.split(",")
                    .map((tm) => parseStringNumber(tm)) || []) as TipoMangaEnum[],
          emision: parseStringNumber(searchParams.get("emision") || "3") as EmisionEnum,
          tipoContenido: tipoContenido,
          orderBy: searchParams.get("orderby") ? (searchParams.get("orderby") === "desc" ? "desc" : "asc") : "asc",
          orderField: (() => {
               const key = (searchParams.get("orderfield") || "key").trim();
               return Object.prototype.hasOwnProperty.call(FieldOrdEnum, key)
                    ? FieldOrdEnum[key as keyof typeof FieldOrdEnum]
                    : FieldOrdEnum.key;
          })(),
          statusView: (() => {
               if (!onlyFavs) return StatusViewEnum.ninguno
               const key = parseStringNumber(searchParams.get("status") || "5")
               const StatusValues = new Set(
                    Object.values(StatusViewEnum)
               );
               return StatusValues.has(key as StatusViewEnum) ? key : StatusViewEnum.ninguno
          })() as StatusViewEnum
     };
}

export function getURLParamsAM(tipo: TipoContenidoEnum, filtersParam: FilterParamsInterface, page: number) {
     const actualParams = new URLSearchParams()
     if (filtersParam.tit_search.trim()) actualParams.append("tit_search", filtersParam.tit_search.trim())
     if (filtersParam.emision) actualParams.append("emision", String(filtersParam.emision))
     if (filtersParam.generos.length > 0) actualParams.append("genres", filtersParam.generos.join(","))
     if (tipo === TipoContenidoEnum.manga) {
          if (filtersParam.editoriales.length > 0) actualParams.append("editorials", filtersParam.editoriales.join(","))
          if (filtersParam.autores.length > 0) actualParams.append("authors", filtersParam.autores.join(","))
          if (filtersParam.tiposManga.length > 0) actualParams.append("tiposManga", filtersParam.tiposManga.join(","))
     }

     if (tipo === TipoContenidoEnum.anime) {
          if (filtersParam.estudios.length > 0) actualParams.append("studios", filtersParam.estudios.join(","))
          if (filtersParam.tiposAnime.length > 0) actualParams.append("tiposAnime", filtersParam.tiposAnime.join(","))
     }
     if (page > 1) actualParams.append("page", String(page));


     const queryParams = actualParams.toString()

     const url = `/explore/${tipo === TipoContenidoEnum.anime ? "animes" : "mangas"}?${queryParams}`
     return url
}