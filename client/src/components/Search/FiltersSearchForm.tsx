import { Accordion, AccordionTab } from "primereact/accordion";
import { MultiSelect } from "primereact/multiselect";
import type {
   FilterObjSchema,
   FiltersAdvancedSearchSchema,
} from "../../schemas/filtersSchemas";
import { useEffect, useId, useState } from "react";
import { getFilters } from "../../services/searchServices";
import { Spinner } from "flowbite-react";
import {
   optionsEmision,
   TipoContenidoEnum,
   type FilterParamsInterface,
   type OptionsSelectInterface,
} from "../../types/filterTypes";
import { Dropdown } from "primereact/dropdown";
import { optionsTipoAnime } from "../../types/animeTypes";
import { optionsTipoManga } from "../../types/mangaTypes";

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
   selTiposAnime,
   setSelTiposAnime,
   selTiposManga,
   setSelTiposManga,
   tipoContenido,
}: FiltersProps) {
   const [loadingFilters, setLoadingFilters] = useState<boolean>(true);
   const idSelGenres = useId();
   const idSelEmison = useId();
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
            })
            .catch((error) => {
               console.log(error);
            })
            .finally(() => setLoadingFilters(false));
      };
      fetchFilters();
   }, []);

   const footerTemplate = (selectedF: FilterObjSchema[]) => {
      const length = selectedF.length;

      return (
         <div className="py-2 px-3">
            <b>{length > 0 ? length : ""}</b>
            {length > 1
               ? " opciones seleccionadas."
               : length === 0
               ? ""
               : " opción seleccionada."}
         </div>
      );
   };
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
                        <MultiSelect
                           id={idSelTiposManga}
                           value={selTiposManga}
                           options={optionsTipoManga}
                           onChange={(e) => setSelTiposManga(e.value)}
                           optionLabel="name"
                           placeholder="Selecciona los tipos de Manga"
                           panelFooterTemplate={() =>
                              footerTemplate(selTiposManga)
                           }
                           className="md:w-full mb-2 min-w-0 w-60"
                           display="chip"
                        />
                        <MultiSelect
                           id={idSelEditorials}
                           value={selEditoriales}
                           options={advFilters?.editorialesList ?? []}
                           onChange={(e) => setSelEditoriales(e.value)}
                           optionLabel="name"
                           placeholder="Selecciona una Editorial de Manga"
                           panelFooterTemplate={() =>
                              footerTemplate(selEditoriales)
                           }
                           className="md:w-full mb-2 min-w-0 w-60"
                           display="chip"
                        />
                        <MultiSelect
                           id={idSelAuthors}
                           value={selAutores}
                           options={advFilters?.autoresList ?? []}
                           onChange={(e) => setSelAutores(e.value)}
                           optionLabel="name"
                           placeholder="Selecciona un Autor de Manga"
                           panelFooterTemplate={() =>
                              footerTemplate(selAutores)
                           }
                           className="md:w-full mb-2 min-w-0 w-60"
                           display="chip"
                        />
                     </>
                  )}
                  <MultiSelect
                     id={idSelGenres}
                     value={selGenres}
                     options={advFilters?.genresList ?? []}
                     onChange={(e) => setSelGenres(e.value)}
                     optionLabel="name"
                     placeholder="Selecciona un Genero"
                     panelFooterTemplate={() => footerTemplate(selGenres)}
                     className="md:w-full mb-2 min-w-0 w-60"
                     display="chip"
                  />
                  {(tipoContenido === TipoContenidoEnum.anime ||
                     tipoContenido === TipoContenidoEnum.todos) && (
                     <>
                        <MultiSelect
                           id={idSelTiposAnime}
                           value={selTiposAnime}
                           options={optionsTipoAnime}
                           onChange={(e) => setSelTiposAnime(e.value)}
                           optionLabel="name"
                           placeholder="Selecciona los tipos de Anime"
                           panelFooterTemplate={() =>
                              footerTemplate(selTiposAnime)
                           }
                           className="md:w-full mb-2 min-w-0 w-60"
                           display="chip"
                        />
                        <MultiSelect
                           id={idSelStudios}
                           value={selStudios}
                           options={advFilters?.studiosList ?? []}
                           onChange={(e) => setSelStudios(e.value)}
                           optionLabel="name"
                           placeholder="Selecciona un Estudio de Animación"
                           panelFooterTemplate={() =>
                              footerTemplate(selStudios)
                           }
                           className="md:w-full mb-2 min-w-0 w-60"
                           display="chip"
                        />
                     </>
                  )}
               </div>
            </AccordionTab>
         </Accordion>
      )
   );
}
