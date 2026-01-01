import { TvMinimalPlay } from "lucide-react";
import { CarouselAnime } from "../components/Anime/CarouselAnime";
import { useEffect, useState } from "react";
import { getAnimes } from "../services/animeServices";
import { PaginationSkeleton } from "../components/Skeletons/PaginationSekeleton";
import { AnimePagination } from "../components/Anime/AnimePagination";
import { useSearchParams } from "react-router";
import { Breadcrumbs } from "../components/Layout/BreadCrumbs";
import type { AnimeSchema } from "../schemas/animeSchemas";

export default function AnimePage() {
   const [searchParams, setSearchParams] = useSearchParams();

   const [page, setPage] = useState<number>(() => {
      const p = parseInt(searchParams.get("page") ?? "0", 10);
      return Number.isNaN(p) || p <= 0 ? 0 : (p - 1) * 20;
   });
   const [total, setTotalAnimes] = useState<number>(0);
   const [animes, setAnimes] = useState<AnimeSchema[]>([]);
   const [loading, setLoading] = useState<boolean>(true);

   const fetchAnimes = () => {
      getAnimes("/anime/", { limit: 20, page: page / 20 + 1, emision: 3 })
         .then((resp) => {
            setAnimes(resp.listaAnimes ?? []);
            setTotalAnimes(resp.totalAnimes ?? 0);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setLoading(false));
   };

   useEffect(() => {
      fetchAnimes();
      setSearchParams((params: URLSearchParams) => {
         params.set("page", String(page / 20 + 1));

         return params;
      });
   }, [page]);

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         <Breadcrumbs
            items={[{ label: "Home", to: "/" }, { label: "Animes" }]}
         />
         <h1 className="text-5xl font-bold flex flex-row gap-5 underline">
            <TvMinimalPlay size={45} /> Animes
         </h1>
         <section>
            <CarouselAnime
               isEmision={true}
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
                  <h2 className="text-xl font-bold">Lista de Animes</h2>
                  <AnimePagination
                     total={total}
                     page={page}
                     setLoading={setLoading}
                     setPage={setPage}
                     animes={animes}
                  />
               </>
            )}
         </section>
      </main>
   );
}
