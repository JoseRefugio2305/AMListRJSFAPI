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
import { getFilters } from "../../../../services/searchServices";
import { TopSkeleton } from "../../../Skeletons/TopSkeleton";
import type { MangaCompleteSchema } from "../../../../schemas/mangaSchemas";

interface MultiSelectsFormProps {
   mangaData: MangaCompleteSchema;
   selGenres: FilterObjSchema[];
   setSelGenres: Dispatch<SetStateAction<FilterObjSchema[]>>;
   selEditorials: FilterObjSchema[];
   setSelEditorials: Dispatch<SetStateAction<FilterObjSchema[]>>;
   selAuthors: FilterObjSchema[];
   setSelAuthors: Dispatch<SetStateAction<FilterObjSchema[]>>;
}

export function MultiSelectsForm({
   mangaData,
   selGenres,
   setSelGenres,
   selEditorials,
   setSelEditorials,
   selAuthors,
   setSelAuthors,
}: MultiSelectsFormProps) {
   const idSelGenres = useId();
   const idSelEditorials = useId();
   const idSelAuthors = useId();
   const [advFilters, setAdvFilters] =
      useState<FiltersAdvancedSearchSchema | null>(null);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchOptMulti = async () => {
         setLoading(true);
         await getFilters()
            .then((resp) => {
               setAdvFilters(resp);
               if (mangaData.generos.length > 0) {
                  setSelGenres(
                     mangaData?.generos.map((g) => {
                        const { id_MAL: code, nombre: name } = g;
                        return { code, name };
                     })
                  );
               }
               if (mangaData.editoriales.length > 0) {
                  setSelEditorials(
                     mangaData?.editoriales.map((g) => {
                        const { id_MAL: code, nombre: name } = g;
                        return { code, name };
                     })
                  );
               }
               if (mangaData.autores.length > 0) {
                  setSelAuthors(
                     mangaData?.autores.map((g) => {
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
                  Generos, Editoriales y Autores de Manga
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
               <p className="font-bold">Editoriales de Manga:</p>
               <FilterMultiSelect
                  className="w-full mb-2 min-w-0"
                  id={idSelEditorials}
                  value={selEditorials}
                  options={advFilters?.editorialesList ?? []}
                  onChange={(e) => setSelEditorials(e.value)}
                  placeholder="Selecciona una Editorial de Manga"
               />
               <p className="font-bold">Autores de Manga:</p>
               <FilterMultiSelect
                  className="w-full mb-2 min-w-0"
                  id={idSelAuthors}
                  value={selAuthors}
                  options={advFilters?.autoresList ?? []}
                  onChange={(e) => setSelAuthors(e.value)}
                  placeholder="Selecciona un Autor de Manga"
               />
            </>
         )}
      </>
   );
}
