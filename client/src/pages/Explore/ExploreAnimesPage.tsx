import { Telescope } from "lucide-react";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { useFilters } from "../../hooks/useFilters";
import { TipoContenidoEnum } from "../../types/filterTypes";
import { SearchForm } from "../../components/Search/SearchForm";
import { PaginationSkeleton } from "../../components/Skeletons/PaginationSekeleton";
import { AnimePagination } from "../../components/Anime/AnimePagination";
import { useState } from "react";

export default function ExploreAnimePage() {
   const {
      animes,
      totalAnimes,
      filtersParam,
      setFiltersParam,
      page,
      setPage,
      loading,
      setLoading,
   } = useFilters(TipoContenidoEnum.anime);
   const [layout, setLayout] = useState<"list" | "grid">("grid");

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         <Breadcrumbs
            items={[
               { label: "Home", to: "/" },
               { label: "Explorar", to: "/explore" },
               { label: "Animes" },
            ]}
         />
         <h1 className="text-5xl font-bold flex flex-row gap-5 underline">
            <Telescope size={45} /> Explorar Animes
         </h1>
         <section className="w-auto grid gap-5 shadow-2xl md:rounded-2xl rounded-none dark:bg-gray-700 p-6">
            <h1 className="text-2xl font-bold  text-center">
               Encuentra tu proxima serie:
            </h1>
            <SearchForm
               filtersParam={filtersParam}
               setFiltersParam={setFiltersParam}
               setPage={setPage}
               tipoContenido={TipoContenidoEnum.anime}
            />
         </section>
         <section className="w-full">
            {loading ? (
               <PaginationSkeleton />
            ) : (
               <>
                  {totalAnimes > 0 && (
                     <div className="text-lg md:text-2xl ml-2 text-black dark:text-white font-bold">
                        Resultado: {totalAnimes} Anime(s)
                     </div>
                  )}
                  <AnimePagination
                     total={totalAnimes}
                     page={page}
                     setPage={setPage}
                     setLoading={setLoading}
                     animes={animes}
                     layout={layout}
                     setLayout={setLayout}
                  />
               </>
            )}
         </section>
      </main>
   );
}
