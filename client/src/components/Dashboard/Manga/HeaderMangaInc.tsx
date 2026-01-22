import { useRef, type Dispatch, type SetStateAction } from "react";

import { Button, TextInput } from "flowbite-react";
import { Search } from "lucide-react";
import { Dropdown } from "primereact/dropdown";
import {
   lazyStateInicial,
   optionsReadyToMAL,
   type LazyTableStateInc,
   type OptionsSelectInterface,
} from "../../../types/filterTypes";
import { optionsTipoManga } from "../../../types/mangaTypes";

interface HeaderMangaIncProps {
   loading: boolean;
   setLoading: Dispatch<SetStateAction<boolean>>;
   setLazyState: Dispatch<SetStateAction<LazyTableStateInc>>;
   selTipoManga: OptionsSelectInterface | null;
   setSelTipoManga: Dispatch<SetStateAction<OptionsSelectInterface | null>>;
   selStatusAct: OptionsSelectInterface | null;
   setSelStatusAct: Dispatch<SetStateAction<OptionsSelectInterface | null>>;
}

export function HeaderMangaInc({
   loading,
   setLoading,
   setLazyState,
   setSelStatusAct,
   selStatusAct,
   setSelTipoManga,
   selTipoManga,
}: HeaderMangaIncProps) {
   const titSearch = useRef<HTMLInputElement>(null);
   const handleCleanFilters = () => {
      if (titSearch.current && titSearch.current.value.trim() !== "") {
         titSearch.current.value = "";
      }
      setSelStatusAct(null);
      setSelTipoManga(null);

      setLazyState(lazyStateInicial);
      setLoading(true);
   };
   return (
      <>
         <div className="flex flex-col ga-2">
            <div className="flex flex-col md:flex-row gap-4">
               <TextInput
                  ref={titSearch}
                  name="title_search"
                  type="text"
                  icon={Search}
                  className="w-full md:w-[70%] mb-1"
                  disabled={loading}
                  placeholder="Ingresa el Título a buscar"
               />
               <div className="w-full md:w-[30%] mb-1 flex flex-row gap-3">
                  <Button
                     color="purple"
                     className="w-[50%] mb-3 shrink-0"
                     type="button"
                     onClick={() => {
                        if (
                           titSearch.current &&
                           titSearch.current.value.trim() !== ""
                        ) {
                           setLoading(true);

                           const value = titSearch.current?.value.trim();

                           setLazyState((prev: LazyTableStateInc) => {
                              return {
                                 ...prev,
                                 filters: {
                                    ...prev.filters,
                                    global: {
                                       ...prev.filters.global,
                                       value: value,
                                    },
                                 },
                              };
                           });
                        }
                     }}
                     disabled={loading}
                  >
                     Buscar
                  </Button>
                  <Button
                     color="purple"
                     className="w-[50%] mb-3 shrink-0"
                     onClick={handleCleanFilters}
                     outline
                  >
                     Limpiar Filtros
                  </Button>
               </div>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-3">
               <Dropdown
                  value={selTipoManga}
                  options={optionsTipoManga}
                  optionLabel="name"
                  onChange={(e) => {
                     const value = e.value
                        ? (e.value as OptionsSelectInterface)
                        : null;
                     setSelTipoManga(value);
                     if (value) {
                        setLazyState((prev: LazyTableStateInc) => {
                           return {
                              ...prev,
                              filters: {
                                 ...prev.filters,
                                 tipo: {
                                    ...prev.filters.tipo,
                                    value: value.code,
                                 },
                              },
                           };
                        });
                     }
                  }}
                  placeholder="Tipo de Manga"
                  className="ml-1 p-column-filter"
                  showClear
                  style={{ minWidth: "12rem" }}
               />
               <Dropdown
                  value={selStatusAct}
                  optionLabel="name"
                  options={optionsReadyToMAL}
                  onChange={(e) => {
                     const value = e.value
                        ? (e.value as OptionsSelectInterface)
                        : null;
                     setSelStatusAct(value);
                     if (value) {
                        setLoading(true);
                        setLazyState((prev: LazyTableStateInc) => {
                           return {
                              ...prev,
                              filters: {
                                 ...prev.filters,
                                 status: {
                                    ...prev.filters.status,
                                    value: value.code,
                                 },
                              },
                           };
                        });
                     }
                  }}
                  placeholder="Estado de Actualización"
                  className="ml-1 p-column-filter"
                  showClear
                  style={{ minWidth: "12rem" }}
               />
            </div>
         </div>
      </>
   );
}
