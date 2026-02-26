import { Brush } from "lucide-react";
import { useEffect, useState } from "react";
import { PaginationSkeleton } from "../../components/Skeletons/PaginationSekeleton";
import { useSearchParams } from "react-router";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import type { MangaSchema } from "../../schemas/mangaSchemas";
import { getMangas } from "../../services/mangaServices";
import { CarouselManga } from "../../components/Manga/CarouselManga";
import { MangaPagination } from "../../components/Manga/MangaPagination";
import { parseStringNumber } from "../../utils/parse";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function MangaPage() {
   useDocumentTitle("Mangas")
   const [searchParams, setSearchParams] = useSearchParams();

   const [page, setPage] = useState<number>(() =>
      parseStringNumber(searchParams.get("page") ?? "1"),
   );
   const [total, setTotalMangas] = useState<number>(0);
   const [mangas, setMangas] = useState<MangaSchema[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [layout, setLayout] = useState<"list" | "grid">("grid");

   const fetchMangas = () => {
      getMangas("/manga/", { limit: 20, page: page > 1 ? page : 1, emision: 3 })
         .then((resp) => {
            setMangas(resp.listaMangas ?? []);
            setTotalMangas(resp.totalMangas ?? 0);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setLoading(false));
   };

   useEffect(() => {
      fetchMangas();
      setSearchParams((params: URLSearchParams) => {
         if (page > 1) {
            params.set("page", String(page));
         } else {
            params.delete("page");
         }

         return params;
      });
   }, [page]);

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         <Breadcrumbs
            items={[{ label: "Home", to: "/" }, { label: "Mangas" }]}
         />
         <h1 className="text-5xl font-bold flex flex-row gap-5 underline">
            <Brush size={45} /> Mangas
         </h1>
         <section>
            <CarouselManga
               isPublicacion={true}
               onlyFavs={false}
               username={""}
               isOwnProfile={false}
            />
         </section>
         <section className="w-full">
            {loading ? (
               <PaginationSkeleton />
            ) : (
               <>
                  <h2 className="text-xl font-bold">Lista de Mangas</h2>
                  <MangaPagination
                     total={total}
                     page={page}
                     setLoading={setLoading}
                     setPage={setPage}
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
