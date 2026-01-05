import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { AnimeCard } from "./AnimeCard";
import { NotResultsFound } from "../Common/NotResultsFound";
import type { AnimeSchema } from "../../schemas/animeSchemas";

interface AnimePaginationProps {
   page: number;
   total: number;
   setLoading: (load: boolean) => void;
   setPage: (first: number) => void;
   animes: AnimeSchema[];
}

export function AnimePagination({
   page,
   total,
   setLoading,
   setPage,
   animes,
}: AnimePaginationProps) {
   const handlePageChange = (event: PaginatorPageChangeEvent) => {
      setLoading(true);
      setPage(event.first / 20 + 1);
   };

   return (
      <>
         {animes.length > 0 ? (
            <>
               <Paginator
                  first={(page - 1) * 20}
                  rows={20}
                  totalRecords={total}
                  onPageChange={handlePageChange}
               />
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                  {animes.map((anime: AnimeSchema) => (
                     <AnimeCard {...anime} key={anime.id} />
                  ))}
               </div>
               <Paginator
                  first={(page - 1) * 20}
                  rows={20}
                  totalRecords={total}
                  onPageChange={handlePageChange}
               />
            </>
         ) : (
            <NotResultsFound message="No hay Animes que coincidan con la búsqueda." />
         )}
      </>
   );
}
