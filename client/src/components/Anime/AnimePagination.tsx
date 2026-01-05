import { useState } from "react";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import type { AnimeSchema } from "../../schemas/animeSchemas";
import { AnimeCard } from "../Anime/AnimeCard";
import { AnimeListCard } from "../Anime/AnimeListCard";
import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { NotResultsFound } from "../Common/NotResultsFound";

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
   const [layout, setLayout] = useState<"list" | "grid">("grid");

   const handlePageChange = (event: PaginatorPageChangeEvent) => {
      setLoading(true);
      setPage(event.first / 20 + 1);
   };

   const listItem = (anime: AnimeSchema) => {
      return <AnimeListCard {...anime} key={anime.id} />;
   };

   const gridItem = (anime: AnimeSchema) => {
      return <AnimeCard {...anime} key={anime.id} />;
   };

   const itemTemplate = (product: AnimeSchema, layout: string) => {
      if (!product) {
         return;
      }

      if (layout === "list") return listItem(product);
      else if (layout === "grid") return gridItem(product);
   };

   const listTemplate = (products: AnimeSchema[], layout: "list" | "grid") => {
      return layout === "grid" ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {products.map((product) => itemTemplate(product, layout))}
         </div>
      ) : (
         <div className="grid grid-cols-1">
            {products.map((product) => itemTemplate(product, layout))}
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
                  value={animes}
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
            <NotResultsFound message="No hay Animes que coincidan con la búsqueda." />
         )}
      </div>
   );
}
