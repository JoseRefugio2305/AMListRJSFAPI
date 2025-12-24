import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { NotResultsFound } from "../Common/NotResultsFound";
import type { MangaSchema } from "../../schemas/mangaSchemas";
import { MangaCard } from "./MangaCard";

interface MangaPaginationProps {
   page: number;
   total: number;
   setLoading: (load: boolean) => void;
   setPage: (first: number) => void;
   mangas: MangaSchema[];
}

export function MangaPagination({
   page,
   total,
   setLoading,
   setPage,
   mangas,
}: MangaPaginationProps) {
   const handlePageChange = (event: PaginatorPageChangeEvent) => {
      setLoading(true);
      setPage(event.first);
   };

   return (
      <>
         {mangas.length > 0 ? (
            <>
               <Paginator
                  first={page}
                  rows={20}
                  totalRecords={total}
                  onPageChange={handlePageChange}
               />
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                  {mangas.map((manga: MangaSchema) => (
                     <MangaCard {...manga} key={manga.id} />
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
            <NotResultsFound message="No hay Mangas que coincidan con la búsqueda." />
         )}
      </>
   );
}
