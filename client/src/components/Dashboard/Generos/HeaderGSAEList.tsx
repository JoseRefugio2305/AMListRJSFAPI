import { useRef, type Dispatch, type SetStateAction } from "react";
import {
   lazyStateInicial,
   type LazyTableStateInc,
} from "../../../types/filterTypes";
import { Button, TextInput } from "flowbite-react";
import { Search } from "lucide-react";

interface HeaderGSAEListProps {
   loading: boolean;
   setLoading: Dispatch<SetStateAction<boolean>>;
   setLazyState: Dispatch<SetStateAction<LazyTableStateInc>>;
}

export function HeaderGSAEList({
   loading,
   setLoading,
   setLazyState,
}: HeaderGSAEListProps) {
   const nameSearch = useRef<HTMLInputElement>(null);
   const handleCleanFilters = () => {
      if (nameSearch.current && nameSearch.current.value.trim() !== "") {
         nameSearch.current.value = "";
      }

      setLazyState(lazyStateInicial);
      setLoading(true);
   };

   return (
      <>
         <div className="flex flex-col ga-2">
            <div className="flex flex-col md:flex-row gap-4">
               <TextInput
                  ref={nameSearch}
                  name="name_search"
                  type="text"
                  icon={Search}
                  className="w-full md:w-[70%] mb-1"
                  disabled={loading}
                  placeholder="Ingresa el Nombre a buscar"
               />
               <div className="w-full md:w-[30%] mb-1 flex flex-row gap-3">
                  <Button
                     color="purple"
                     className="w-[50%] mb-3 shrink-0"
                     type="button"
                     onClick={() => {
                        if (
                           nameSearch.current &&
                           nameSearch.current.value.trim() !== ""
                        ) {
                           setLoading(true);

                           const value = nameSearch.current?.value.trim();

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
         </div>
      </>
   );
}
