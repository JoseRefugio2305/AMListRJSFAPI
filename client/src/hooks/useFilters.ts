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
import { getUserAnimeList, getUserMangaList } from "../services/userServices";

export const useFilters = (tipoContenido: TipoContenidoEnum, onlyFavs: boolean = false, username: string = "") => {
     const [searchParams, setSearchParams] = useSearchParams();
     const [animes, setAnimes] = useState<AnimeSchema[]>([]);
     const [totalAnimes, setTotalAnimes] = useState<number>(0);
     const [mangas, setMangas] = useState<MangaSchema[]>([]);
     const [totalMangas, setTotalMangas] = useState<number>(0);
     const [loading, setLoading] = useState<boolean>(true);

     const [filtersParam, setFiltersParam] = useState<FilterParamsInterface>(
          () => getInitialFilters(searchParams, tipoContenido, onlyFavs)
     );
     const [page, setPage] = useState<number>(
          tipoContenido === TipoContenidoEnum.todos ? 0 : parseStringNumber(searchParams.get("page") ?? "1")
     );

     useSyncSearchParams(filtersParam, page, setSearchParams, onlyFavs)

     useEffect(() => {
          const fetchResultsSearch = () => {
               setLoading(true);
               const filtersPayload: FilterPayload = {
                    limit: 20,
                    page: page > 1 ? page : 1,
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
                    orderField: filtersParam.orderField,
               };

               if (onlyFavs && username.trim()) {
                    filtersPayload.onlyFavs = true
                    filtersPayload.statusView = filtersParam.statusView
                    if (tipoContenido === TipoContenidoEnum.anime) {
                         getUserAnimeList(username, filtersPayload)
                              .then((resp) => {
                                   setAnimes(resp.listaAnimes ?? []);
                                   setTotalAnimes(resp.totalAnimes ?? 0);
                              }).catch((error) => {
                                   console.error(error);
                              })
                              .finally(() => setLoading(false));
                    } else {
                         getUserMangaList(username, filtersPayload)
                              .then((resp) => {
                                   setMangas(resp.listaMangas ?? []);
                                   setTotalMangas(resp.totalMangas ?? 0);
                              }).catch((error) => {
                                   console.error(error);
                              })
                              .finally(() => setLoading(false));
                    }
               } else {
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
                         .finally(() => setLoading(false));
               }
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
          setLoading,
          getURLParamsAM
     };
};