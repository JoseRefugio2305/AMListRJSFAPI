import {
   useEffect,
   useId,
   useState,
   type Dispatch,
   type SetStateAction,
} from "react";
import type {
   FilterObjSchema,
   FiltersAdvancedSearchSchema,
} from "../../../../schemas/filtersSchemas";
import { FilterMultiSelect } from "../../../Search/FilterMultiSelect";
import type { AnimeCompleteSchema } from "../../../../schemas/animeSchemas";
import { getFilters } from "../../../../services/searchServices";
import { TopSkeleton } from "../../../Skeletons/TopSkeleton";

interface MultiSelectsFormProps {
   animeData: AnimeCompleteSchema;
   selGenres: FilterObjSchema[];
   setSelGenres: Dispatch<SetStateAction<FilterObjSchema[]>>;
   selStudios: FilterObjSchema[];
   setSelStudios: Dispatch<SetStateAction<FilterObjSchema[]>>;
}

export function MultiSelectsForm({
   animeData,
   selGenres,
   setSelGenres,
   selStudios,
   setSelStudios,
}: MultiSelectsFormProps) {
   const idSelGenres = useId();
   const idSelStudios = useId();
   const [advFilters, setAdvFilters] =
      useState<FiltersAdvancedSearchSchema | null>(null);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchOptMulti = async () => {
         setLoading(true);
         await getFilters()
            .then((resp) => {
               setAdvFilters(resp);
               if (animeData.generos.length > 0) {
                  setSelGenres(
                     animeData?.generos.map((g) => {
                        const { id_MAL: code, nombre: name } = g;
                        return { code, name };
                     })
                  );
               }
               if (animeData.studios.length > 0) {
                  setSelStudios(
                     animeData?.studios.map((g) => {
                        const { id_MAL: code, nombre: name } = g;
                        return { code, name };
                     })
                  );
               }
               setLoading(false);
            })
            .catch((error) => {
               console.log(error);
            });
      };
      fetchOptMulti();
   }, []);
   return (
      <>
         {loading ? (
            <TopSkeleton />
         ) : (
            <>
               <h2 className="text-2xl font-bold">
                  Generos y Estudios de Animación
               </h2>
               <p className="font-bold">Generos:</p>
               <FilterMultiSelect
                  className="w-full mb-2 min-w-0"
                  id={idSelGenres}
                  value={selGenres}
                  options={advFilters?.genresList ?? []}
                  onChange={(e) => setSelGenres(e.value)}
                  placeholder="Selecciona un Genero"
               />
               <p className="font-bold">Estudios de Animación:</p>
               <FilterMultiSelect
                  className="w-full mb-2 min-w-0"
                  id={idSelStudios}
                  value={selStudios}
                  options={advFilters?.studiosList ?? []}
                  onChange={(e) => setSelStudios(e.value)}
                  placeholder="Selecciona un Estudio de Animación"
               />
            </>
         )}
      </>
   );
}
