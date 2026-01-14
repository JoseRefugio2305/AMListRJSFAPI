import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { NotResultsFound } from "../Common/NotResultsFound";
import type { MangaSchema } from "../../schemas/mangaSchemas";
import { MangaListCard } from "./MangaListCard";
import { MangaCard } from "./MangaCard";
import type { Dispatch, SetStateAction } from "react";

interface MangaPaginationProps {
   page: number;
   total: number;
   setLoading: Dispatch<SetStateAction<boolean>>;
   setPage: Dispatch<SetStateAction<number>>;
   mangas: MangaSchema[];
   layout: "list" | "grid";
   setLayout: Dispatch<SetStateAction<"list" | "grid">>;
}
export function MangaPagination({
   page,
   total,
   setLoading,
   setPage,
   mangas,
   layout,
   setLayout,
}: MangaPaginationProps) {
   // const [layout, setLayout] = useState<"list" | "grid">("grid");

   const handlePageChange = (event: PaginatorPageChangeEvent) => {
      setLoading(true);
      setPage(event.first / 20 + 1);
   };

   const listItem = (manga: MangaSchema) => {
      return <MangaListCard {...manga} key={manga.id} />;
   };

   const gridItem = (manga: MangaSchema) => {
      return <MangaCard {...manga} key={manga.id} />;
   };

   const itemTemplate = (manga: MangaSchema, layout: string) => {
      if (!manga) {
         return;
      }

      if (layout === "list") return listItem(manga);
      else if (layout === "grid") return gridItem(manga);
   };

   const listTemplate = (mangas: MangaSchema[], layout: "list" | "grid") => {
      return layout === "grid" ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {mangas.map((manga) => itemTemplate(manga, layout))}
         </div>
      ) : (
         <div className="grid grid-cols-1">
            {mangas.map((manga) => itemTemplate(manga, layout))}
         </div>
      );
   };

   const header = () => {
      return (
         <div className="flex justify-end">
            <DataViewLayoutOptions
               layout={layout}
               onChange={(e) => setLayout(e.value === "list" ? "list" : "grid")}
            />
         </div>
      );
   };

   return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
         {total > 0 ? (
            <>
               <Paginator
                  first={(page - 1) * 20}
                  rows={20}
                  totalRecords={total}
                  onPageChange={handlePageChange}
               />
               <DataView
                  value={mangas}
                  listTemplate={listTemplate}
                  layout={layout}
                  header={header()}
               />
               <Paginator
                  first={(page - 1) * 20}
                  rows={20}
                  totalRecords={total}
                  onPageChange={handlePageChange}
               />
            </>
         ) : (
            <NotResultsFound message="No hay Mangas que coincidan con la búsqueda." />
         )}
      </div>
   );
}
