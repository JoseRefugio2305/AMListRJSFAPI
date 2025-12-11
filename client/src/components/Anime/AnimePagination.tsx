import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { AnimeCard } from "./AnimeCard";
import type { Anime } from "../../types/animeTypes";
import { NotResultsFound } from "../Common/NotResultsFound";

interface AnimePaginationProps {
   page: number;
   total: number;
   setLoading: (load: boolean) => void;
   setPage: (first: number) => void;
   animes: [Anime] | [];
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
      setPage(event.first);
   };

   return (
      <>
         {animes.length > 0 ? (
            <>
               <Paginator
                  first={page}
                  rows={20}
                  totalRecords={total}
                  onPageChange={handlePageChange}
               />
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                  {animes.map((anime: Anime) => (
                     <AnimeCard {...anime} key={anime.id} />
                  ))}
               </div>
               <Paginator
                  first={page}
                  rows={20}
                  totalRecords={total}
                  onPageChange={(event) => setPage(event.first)}
               />
            </>
         ) : (
            <NotResultsFound message="No hay Animes que coincidan con la búsqueda." />
         )}
      </>
   );
}
