import {
   Brush,
   SquareArrowOutUpRightIcon,
   Telescope,
   TvMinimalPlay,
} from "lucide-react";
import { TabItem, Tabs } from "flowbite-react";
import { useFilters } from "../../hooks/useFilters";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { SearchForm } from "../../components/Search/SearchForm";
import { PaginationSkeleton } from "../../components/Skeletons/PaginationSekeleton";
import { AnimePagination } from "../../components/Anime/AnimePagination";
import { MangaPagination } from "../../components/Manga/MangaPagination";
import { TipoContenidoEnum } from "../../types/filterTypes";
import { Link } from "react-router";
import { useState } from "react";
export default function ExplorePage() {
   const {
      animes,
      totalAnimes,
      totalMangas,
      mangas,
      filtersParam,
      setFiltersParam,
      page,
      setPage,
      loading,
      setLoading,
      getURLParamsAM,
   } = useFilters(TipoContenidoEnum.todos);

   const [layout, setLayout] = useState<"list" | "grid">("grid");

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         <Breadcrumbs
            items={[{ label: "Home", to: "/" }, { label: "Explorar" }]}
         />
         <h1 className="text-5xl font-bold flex flex-row gap-5 underline">
            <Telescope size={45} /> Explorar
         </h1>
         <section className="w-auto grid gap-5 shadow-2xl md:rounded-2xl rounded-none dark:bg-gray-700 p-6">
            <h1 className="text-2xl font-bold  text-center">
               Explora todo el contenido:
            </h1>
            <SearchForm
               filtersParam={filtersParam}
               setFiltersParam={setFiltersParam}
               setPage={setPage}
               tipoContenido={TipoContenidoEnum.todos}
            />
         </section>
         <section className="w-full">
            {loading ? (
               <PaginationSkeleton />
            ) : (
               <Tabs variant="underline" className="w-full justify-center">
                  <TabItem
                     title={
                        <div className="text-lg md:text-2xl ml-2">
                           {totalAnimes} Anime(s){" "}
                        </div>
                     }
                     icon={() => {
                        return <TvMinimalPlay size={24} />;
                     }}
                     active={
                        filtersParam.tipoContenido === 1 ||
                        filtersParam.tipoContenido === 3
                     }
                  >
                     {totalAnimes > 0 && (
                        <p className=" font-bold text-lg m-2  p-2 w-full text-black dark:text-white justify-center items-center">
                           Mostrando {totalAnimes > 20 ? "20" : totalAnimes} de{" "}
                           {totalAnimes} animes.
                        </p>
                     )}
                     <Link
                        className="hover:underline hover:bg-purple-700 hover:text-white font-bold text-lg m-2  bg-purple-500 rounded-full p-2 flex w-full text-white justify-center items-center"
                        to={getURLParamsAM(
                           TipoContenidoEnum.anime,
                           filtersParam,
                           page
                        )}
                     >
                        Más Animes <SquareArrowOutUpRightIcon size={24} />
                     </Link>
                     <AnimePagination
                        total={totalAnimes > 20 ? 20 : totalAnimes}
                        page={page}
                        setPage={setPage}
                        setLoading={setLoading}
                        animes={animes}
                        layout={layout}
                        setLayout={setLayout}
                     />
                  </TabItem>
                  <TabItem
                     title={
                        <div className="text-lg md:text-2xl ml-2">
                           {totalMangas} Manga(s)
                        </div>
                     }
                     icon={() => {
                        return <Brush size={24} />;
                     }}
                     active={filtersParam.tipoContenido === 2}
                  >
                     {totalMangas > 0 && (
                        <p className=" font-bold text-lg m-2  p-2 w-full text-black dark:text-white justify-center items-center">
                           Mostrando {totalMangas > 20 ? "20" : totalMangas} de{" "}
                           {totalMangas} mangas.
                        </p>
                     )}
                     <Link
                        className="hover:underline hover:bg-purple-700 hover:text-white font-bold text-lg m-2  bg-purple-500 rounded-full p-2 flex w-full text-white justify-center items-center"
                        to={getURLParamsAM(
                           TipoContenidoEnum.manga,
                           filtersParam,
                           page
                        )}
                     >
                        Más Mangas <SquareArrowOutUpRightIcon size={24} />
                     </Link>
                     <MangaPagination
                        total={totalMangas > 20 ? 20 : totalMangas}
                        page={page}
                        setPage={setPage}
                        setLoading={setLoading}
                        mangas={mangas}
                        layout={layout}
                        setLayout={setLayout}
                     />
                  </TabItem>
               </Tabs>
            )}
         </section>
      </main>
   );
}
