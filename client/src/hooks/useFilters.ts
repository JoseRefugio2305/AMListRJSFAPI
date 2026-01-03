import { useSearchParams } from "react-router";
import { parseStringNumber } from "../utils/parse";
import { useEffect, useState } from "react";
import type { AnimeSchema } from "../schemas/animeSchemas";
import type { MangaSchema } from "../schemas/mangaSchemas";
import { EmisionEnum, TipoContenidoEnum, type FilterParamsInterface, type FilterPayload } from "../types/filterTypes";
import { getTipoContenido } from "../utils/common";
import { doAdvancedSearch } from "../services/searchServices";
import { getInitialFilters, getURLParamsAM } from "../utils/filters";
import { useSyncSearchParams } from "./useSyncSearchParams";

export const useFilters = (tipoContenido: TipoContenidoEnum) => {
     const [searchParams, setSearchParams] = useSearchParams();
     const [animes, setAnimes] = useState<AnimeSchema[]>([]);
     const [totalAnimes, setTotalAnimes] = useState<number>(0);
     const [mangas, setMangas] = useState<MangaSchema[]>([]);
     const [totalMangas, setTotalMangas] = useState<number>(0);
     const [loading, setLoaging] = useState<boolean>(true);

     const [filtersParam, setFiltersParam] = useState<FilterParamsInterface>(
          () => getInitialFilters(searchParams, tipoContenido)
     );
     const [page, setPage] = useState<number>(
          tipoContenido === TipoContenidoEnum.todos ? 0 : parseStringNumber(searchParams.get("page") ?? "0")
     );

     useSyncSearchParams(filtersParam, page, setSearchParams)

     useEffect(() => {
          const fetchResultsSearch = () => {
               setLoaging(true);
               const filtersPayload: FilterPayload = {
                    limit: 20,
                    page: page / 20 + 1,
                    tituloBusq: filtersParam.tit_search,
                    generos: filtersParam.generos,
                    animeEstudios: filtersParam.estudios,
                    mangaAutores: filtersParam.autores,
                    mangaEditoriales: filtersParam.editoriales,
                    tiposAnime: filtersParam.tiposAnime,
                    tiposManga: filtersParam.tiposManga,
                    emision: Object.values(EmisionEnum).includes(filtersParam.emision)
                         ? filtersParam.emision
                         : 3,
                    tipoContenido: Object.values(TipoContenidoEnum).includes(
                         filtersParam.tipoContenido
                    )
                         ? filtersParam.tipoContenido === 1 ||
                              filtersParam.tipoContenido === 2
                              ? filtersParam.tipoContenido
                              : getTipoContenido(
                                   filtersParam.estudios.length,
                                   filtersParam.editoriales.length,
                                   filtersParam.autores.length,
                                   filtersParam.tiposAnime.length,
                                   filtersParam.tiposManga.length
                              )
                         : 3,
                    orderBy: filtersParam.orderBy === "asc" ? 1 : -1,
                    orderField: filtersParam.orderField
               };

               doAdvancedSearch(filtersPayload)
                    .then((resp) => {
                         setAnimes(resp.listaAnimes ?? []);
                         setTotalAnimes(resp.totalAnimes ?? 0);
                         setMangas(resp.listaMangas ?? []);
                         setTotalMangas(resp.totalMangas ?? 0);
                    })
                    .catch((error) => {
                         console.error(error);
                    })
                    .finally(() => setLoaging(false));
          };
          fetchResultsSearch();
     }, [filtersParam, page]);


     return {
          page,
          setPage,
          filtersParam,
          setFiltersParam,
          animes,
          totalAnimes,
          mangas,
          totalMangas,
          loading,
          setLoaging,
          getURLParamsAM
     };
};