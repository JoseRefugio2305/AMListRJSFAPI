import { Telescope } from "lucide-react";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { useFilters } from "../../hooks/useFilters";
import { TipoContenidoEnum } from "../../types/filterTypes";
import { SearchForm } from "../../components/Search/SearchForm";
import { PaginationSkeleton } from "../../components/Skeletons/PaginationSekeleton";
import { MangaPagination } from "../../components/Manga/MangaPagination";
import { useState } from "react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function ExploreMangaPage() {
   useDocumentTitle("Explorar Mangas")
   const {
      totalMangas,
      mangas,
      filtersParam,
      setFiltersParam,
      page,
      setPage,
      loading,
      setLoading,
   } = useFilters(TipoContenidoEnum.manga);

   const [layout, setLayout] = useState<"list" | "grid">("grid");

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         <Breadcrumbs
            items={[
               { label: "Home", to: "/" },
               { label: "Explorar", to: "/explore" },
               { label: "Mangas" },
            ]}
         />
         <h1 className="text-5xl font-bold flex flex-row gap-5 underline">
            <Telescope size={45} /> Explorar Mangas
         </h1>
         <section className="w-auto grid gap-5 shadow-2xl md:rounded-2xl rounded-none dark:bg-gray-700 p-6">
            <h1 className="text-2xl font-bold  text-center">
               Encuentra tu proxima gran lectura:
            </h1>
            <SearchForm
               filtersParam={filtersParam}
               setFiltersParam={setFiltersParam}
               setPage={setPage}
               tipoContenido={TipoContenidoEnum.manga}
            />
         </section>
         <section className="w-full">
            {loading ? (
               <PaginationSkeleton />
            ) : (
               <>
                  {totalMangas > 0 && (
                     <div className="text-lg md:text-2xl ml-2 text-black dark:text-white font-bold">
                        Resultado: {totalMangas} Manga(s)
                     </div>
                  )}
                  <MangaPagination
                     total={totalMangas}
                     page={page}
                     setPage={setPage}
                     setLoading={setLoading}
                     mangas={mangas}
                     layout={layout}
                     setLayout={setLayout}
                  />
               </>
            )}
         </section>
      </main>
   );
}
