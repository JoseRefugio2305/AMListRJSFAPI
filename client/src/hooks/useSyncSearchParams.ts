import { useEffect } from "react";
import type { FilterParamsInterface } from "../types/filterTypes";
import type { SetURLSearchParams } from "react-router";

export function useSyncSearchParams(
     filtersParam: FilterParamsInterface,
     page: number,
     setSearchParams: SetURLSearchParams,
     onlyFavs: boolean = false
) {
     useEffect(() => {
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

               //Ordenacion
               if (filtersParam.orderBy.trim()) {
                    params.set("orderby", filtersParam.orderBy.trim());
               } else {
                    params.delete("orderby");
               }

               if (filtersParam.orderField.trim()) {
                    params.set("orderfield", filtersParam.orderField.trim());
               } else {
                    params.delete("orderfield");
               }

               //estado de vision solo favoritos
               if (onlyFavs) {
                    if (filtersParam.statusView) {
                         params.set("status", String(filtersParam.statusView));
                    } else {
                         params.delete("status");
                    }
               }

               if (page > 1) {
                    params.set("page", String(page));
               } else {
                    params.delete("page");
               }

               return params;
          });
     }, [filtersParam, page, setSearchParams]);
}