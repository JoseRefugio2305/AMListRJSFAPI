import { useSearchParams } from "react-router";
import { parseStringNumber } from "../utils/parse";
import { useEffect, useState } from "react";
import type { AnimeSchema } from "../schemas/animeSchemas";
import type { MangaSchema } from "../schemas/mangaSchemas";
import { EmisionEnum, TipoContenidoEnum, type FilterParamsInterface, type FilterPayload } from "../types/filterTypes";
import { getTipoContenido } from "../utils/common";
import { doAdvancedSearch } from "../services/searchServices";

export const useFilters = (tipoContenido: TipoContenidoEnum) => {
     const [searchParams, setSearchParams] = useSearchParams();
     const [animes, setAnimes] = useState<AnimeSchema[]>([]);
     const [totalAnimes, setTotalAnimes] = useState<number>(0);
     const [mangas, setMangas] = useState<MangaSchema[]>([]);
     const [totalMangas, setTotalMangas] = useState<number>(0);
     const [loading, setLoaging] = useState<boolean>(true);

     const [filtersParam, setFiltersParam] = useState<FilterParamsInterface>(
          () => {
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
                         searchParams
                              .get("tiposAnime")
                              ?.split(",")
                              .map((ta) => parseStringNumber(ta)) || [],
                    tiposManga:
                         searchParams
                              .get("tiposManga")
                              ?.split(",")
                              .map((tm) => parseStringNumber(tm)) || [],
                    emision: parseStringNumber(searchParams.get("emision") || "3"),
                    tipoContenido: tipoContenido,
               };
          }
     );
     const [page, setPage] = useState<number>(
          tipoContenido === TipoContenidoEnum.todos ? 0 : parseStringNumber(searchParams.get("page") ?? "0")
     );

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

     useEffect(() => {
          console.log(filtersParam);
          setSearchParams((params) => {
               //estado de emision/publicacion
               if (filtersParam.emision) {
                    params.set("emision", String(filtersParam.emision));
               } else {
                    params.delete("emision");
               }
               //tipos de anime
               if (filtersParam.tiposAnime.length > 0) {
                    params.set("tiposAnime", filtersParam.tiposAnime.join(","));
               } else {
                    params.delete("tiposAnime");
               }
               //tipos de manga
               if (filtersParam.tiposManga.length > 0) {
                    params.set("tiposManga", filtersParam.tiposManga.join(","));
               } else {
                    params.delete("tiposManga");
               }
               //titulo a de busqueda
               if (filtersParam.tit_search.trim()) {
                    params.set("tit_search", filtersParam.tit_search.trim());
               } else {
                    params.delete("tit_search");
               }
               //autores
               if (filtersParam.autores.length > 0) {
                    params.set("authors", filtersParam.autores.join(","));
               } else {
                    params.delete("authors");
               }
               //generos
               if (filtersParam.generos.length > 0) {
                    params.set("genres", filtersParam.generos.join(","));
               } else {
                    params.delete("genres");
               }
               //editoriales
               if (filtersParam.editoriales.length > 0) {
                    params.set("editorials", filtersParam.editoriales.join(","));
               } else {
                    params.delete("editorials");
               }
               //estudios
               if (filtersParam.estudios.length > 0) {
                    params.set("studios", filtersParam.estudios.join(","));
               } else {
                    params.delete("studios");
               }

               if (page / 20 + 1 > 1) {
                    params.set("page", String(page / 20 + 1));
               } else {
                    params.delete("page");
               }

               return params;
          });
     }, [filtersParam, setSearchParams, page]);

     const getURLParamsAM = (tipo: TipoContenidoEnum) => {
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
          if (page / 20 + 1 > 1) actualParams.append("page", String(page / 20 + 1))

          const queryParams = actualParams.toString()

          const url = `/explore/${tipo === TipoContenidoEnum.anime ? "animes" : "mangas"}?${queryParams}`
          return url
     }

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
          setLoaging, getURLParamsAM
     };
};