import { Accordion, AccordionTab } from "primereact/accordion";
import type {
   FilterObjSchema,
   FiltersAdvancedSearchSchema,
} from "../../schemas/filtersSchemas";
import { useEffect, useId, useState } from "react";
import { getFilters } from "../../services/searchServices";
import { Spinner } from "flowbite-react";
import {
   optionsEmision,
   optionsFieldOrd,
   optionsOrderBy,
   TipoContenidoEnum,
   type FilterParamsInterface,
   type OptionsSelectInterface,
   type OptionsSelectStrInterface,
} from "../../types/filterTypes";
import { Dropdown } from "primereact/dropdown";
import { optionsTipoAnime } from "../../types/animeTypes";
import { optionsTipoManga } from "../../types/mangaTypes";
import { FilterMultiSelect } from "./FilterMultiSelect";

interface FiltersProps {
   filtersParam: FilterParamsInterface;
   selGenres: FilterObjSchema[];
   setSelGenres: (callback: () => FilterObjSchema[]) => void;
   selStudios: FilterObjSchema[];
   setSelStudios: (callback: () => FilterObjSchema[]) => void;
   selEditoriales: FilterObjSchema[];
   setSelEditoriales: (callback: () => FilterObjSchema[]) => void;
   selAutores: FilterObjSchema[];
   setSelAutores: (callback: () => FilterObjSchema[]) => void;
   selEmision: OptionsSelectInterface | null;
   setSelEmision: (item: OptionsSelectInterface) => void;
   selFieldOrd: OptionsSelectStrInterface | null;
   setSelFieldOrd: (item: OptionsSelectStrInterface) => void;
   selOrderBy: OptionsSelectStrInterface | null;
   setSelOrderBy: (item: OptionsSelectStrInterface) => void;
   selTiposAnime: OptionsSelectInterface[];
   setSelTiposAnime: (callback: () => OptionsSelectInterface[]) => void;
   selTiposManga: OptionsSelectInterface[];
   setSelTiposManga: (callback: () => OptionsSelectInterface[]) => void;
   tipoContenido: TipoContenidoEnum;
}

export function FiltersSearchForm({
   filtersParam,
   selGenres,
   setSelGenres,
   selStudios,
   setSelStudios,
   selEditoriales,
   setSelEditoriales,
   selAutores,
   setSelAutores,
   selEmision,
   setSelEmision,
   selFieldOrd,
   setSelFieldOrd,
   selOrderBy,
   setSelOrderBy,
   selTiposAnime,
   setSelTiposAnime,
   selTiposManga,
   setSelTiposManga,
   tipoContenido,
}: FiltersProps) {
   const [loadingFilters, setLoadingFilters] = useState<boolean>(true);
   const idSelGenres = useId();
   const idSelEmison = useId();
   const idSelOrderBy = useId();
   const idSelFieldOrd = useId();
   const idSelTiposAnime = useId();
   const idSelTiposManga = useId();
   const idSelStudios = useId();
   const idSelEditorials = useId();
   const idSelAuthors = useId();

   const [advFilters, setAdvFilters] =
      useState<FiltersAdvancedSearchSchema | null>(null);

   useEffect(() => {
      const fetchFilters = () => {
         getFilters()
            .then((resp) => {
               setAdvFilters(resp);
               if (filtersParam.generos.length > 0) {
                  setSelGenres(() => {
                     const sGenres = new Set(filtersParam.generos);
                     return resp.genresList.filter((g) => sGenres.has(g.code));
                  });
               }
               if (
                  tipoContenido === TipoContenidoEnum.manga ||
                  tipoContenido === TipoContenidoEnum.todos
               ) {
                  if (filtersParam.autores.length > 0) {
                     setSelAutores(() => {
                        const sAutores = new Set(filtersParam.autores);
                        return resp.autoresList.filter((a) =>
                           sAutores.has(a.code)
                        );
                     });
                  }
                  if (filtersParam.editoriales.length > 0) {
                     setSelEditoriales(() => {
                        const sEditoriales = new Set(filtersParam.editoriales);
                        return resp.editorialesList.filter((e) =>
                           sEditoriales.has(e.code)
                        );
                     });
                  }
                  if (filtersParam.tiposManga.length > 0) {
                     setSelTiposManga(() => {
                        const sTManga = new Set(filtersParam.tiposManga);
                        return optionsTipoManga.filter((tm) =>
                           sTManga.has(tm.code)
                        );
                     });
                  }
               }
               if (
                  tipoContenido === TipoContenidoEnum.anime ||
                  tipoContenido === TipoContenidoEnum.todos
               ) {
                  if (filtersParam.estudios.length > 0) {
                     setSelStudios(() => {
                        const sStudios = new Set(filtersParam.estudios);
                        return resp.studiosList.filter((s) =>
                           sStudios.has(s.code)
                        );
                     });
                  }
                  if (filtersParam.tiposAnime.length > 0) {
                     setSelTiposAnime(() => {
                        const sTAnime = new Set(filtersParam.tiposAnime);
                        return optionsTipoAnime.filter((ta) =>
                           sTAnime.has(ta.code)
                        );
                     });
                  }
               }
               if (filtersParam.emision) {
                  const em = optionsEmision.find(
                     (oe) => oe.code == filtersParam.emision
                  );
                  setSelEmision(em ?? optionsEmision[3]);
               }

               if (filtersParam.orderBy) {
                  const ordb = optionsOrderBy.find(
                     (ob) => ob.code === filtersParam.orderBy
                  );
                  setSelOrderBy(ordb ?? optionsOrderBy[0]);
               }

               if (filtersParam.orderField) {
                  const ford = optionsFieldOrd.find(
                     (fo) => fo.code === filtersParam.orderField
                  );
                  setSelFieldOrd(ford ?? optionsFieldOrd[0]);
               }
            })
            .catch((error) => {
               console.log(error);
            })
            .finally(() => setLoadingFilters(false));
      };
      fetchFilters();
   }, []);

   return loadingFilters ? (
      <div className="flex items-center gap-4">
         <Spinner color="purple" aria-label="cargando" />
         <p>Cargando Filtros...</p>
      </div>
   ) : (
      advFilters && (
         <Accordion className="w-full">
            <AccordionTab header="Filtros">
               <div className="card flex flex-col justify-center min-w-0">
                  <Dropdown
                     value={selEmision}
                     onChange={(e) => setSelEmision(e.value)}
                     options={optionsEmision}
                     optionLabel="name"
                     showClear
                     placeholder="Selecciona un estado de Emisión/Publicación"
                     className="md:w-full mb-2 min-w-0 w-60"
                     id={idSelEmison}
                  />
                  {(tipoContenido === TipoContenidoEnum.manga ||
                     tipoContenido === TipoContenidoEnum.todos) && (
                     <>
                        <FilterMultiSelect
                           id={idSelTiposManga}
                           value={selTiposManga}
                           options={optionsTipoManga}
                           onChange={(e) => setSelTiposManga(e.value)}
                           placeholder="Selecciona los tipos de Manga"
                        />
                        <FilterMultiSelect
                           id={idSelEditorials}
                           value={selEditoriales}
                           options={advFilters?.editorialesList ?? []}
                           onChange={(e) => setSelEditoriales(e.value)}
                           placeholder="Selecciona una Editorial de Manga"
                        />
                        <FilterMultiSelect
                           id={idSelAuthors}
                           value={selAutores}
                           options={advFilters?.autoresList ?? []}
                           onChange={(e) => setSelAutores(e.value)}
                           placeholder="Selecciona un Autor de Manga"
                        />
                     </>
                  )}
                  <FilterMultiSelect
                     id={idSelGenres}
                     value={selGenres}
                     options={advFilters?.genresList ?? []}
                     onChange={(e) => setSelGenres(e.value)}
                     placeholder="Selecciona un Genero"
                  />
                  {(tipoContenido === TipoContenidoEnum.anime ||
                     tipoContenido === TipoContenidoEnum.todos) && (
                     <>
                        <FilterMultiSelect
                           id={idSelTiposAnime}
                           value={selTiposAnime}
                           options={optionsTipoAnime}
                           onChange={(e) => setSelTiposAnime(e.value)}
                           placeholder="Selecciona los tipos de Anime"
                        />
                        <FilterMultiSelect
                           id={idSelStudios}
                           value={selStudios}
                           options={advFilters?.studiosList ?? []}
                           onChange={(e) => setSelStudios(e.value)}
                           placeholder="Selecciona un Estudio de Animación"
                        />
                     </>
                  )}
                  <Dropdown
                     value={selOrderBy}
                     onChange={(e) => setSelOrderBy(e.value)}
                     options={optionsOrderBy}
                     optionLabel="name"
                     showClear
                     placeholder="Ordenar en..."
                     className="md:w-full mb-2 min-w-0 w-60"
                     id={idSelOrderBy}
                  />
                  <Dropdown
                     value={selFieldOrd}
                     onChange={(e) => setSelFieldOrd(e.value)}
                     options={optionsFieldOrd}
                     optionLabel="name"
                     showClear
                     placeholder="Ordenar por..."
                     className="md:w-full mb-2 min-w-0 w-60"
                     id={idSelFieldOrd}
                  />
               </div>
            </AccordionTab>
         </Accordion>
      )
   );
}
