import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { getAnimes } from "../../services/animeServices";
import { CarouselSkeleton } from "../Skeletons/CarouselSkeleton";
import { Carousel } from "primereact/carousel";
import { AnimeCard } from "./AnimeCard";
import type { AnimeSchema } from "../../schemas/animeSchemas";

interface CarouselAnimeProps {
   isEmision: boolean;
   onlyFavs: boolean;
}

export function CarouselAnime({ isEmision, onlyFavs }: CarouselAnimeProps) {
   const [animes, setAnimes] = useState<AnimeSchema[]>([]);
   const [total, setTotalAnimes] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(true);
   const rutaPeticion = isEmision ? "anime/emision/" : "anime/";

   useEffect(() => {
      getAnimes(rutaPeticion, {
         limit: 20,
         page: 1,
         emision: isEmision ? 1 : 3,
         onlyFavs,
      })
         .then((resp) => {
            setAnimes(resp.listaAnimes ?? []);
            setTotalAnimes(resp.totalAnimes ?? 0);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setLoading(false));
   }, []);

   const responsiveOptions = [
      {
         breakpoint: "1200px",
         numVisible: 4,
         numScroll: 4,
         autoplayInterval: total > 5 ? 10000 : 0,
      },
      {
         breakpoint: "990px",
         numVisible: 3,
         numScroll: 3,
         autoplayInterval: total > 3 ? 10000 : 0,
      },
      {
         breakpoint: "768px",
         numVisible: 2,
         numScroll: 2,
         autoplayInterval: total > 2 ? 10000 : 0,
      },
      {
         breakpoint: "515px",
         numVisible: 1,
         numScroll: 1,
         autoplayInterval: total > 1 ? 10000 : 0,
      },
   ];

   return (
      <div className="pb-6">
         {loading ? (
            <CarouselSkeleton />
         ) : (
            <>
               <div className="flex flex-row gap-3">
                  <h2 className="text-xl font-bold">
                     Animes{" "}
                     {isEmision ? "en Emisión" : onlyFavs ? "en Favoritos" : ""}
                  </h2>
                  <Link
                     to="/explore/animes?emision=1" //TODO: link en caso de emision, favoritos o normales
                     className="flex flex-row btn-link"
                  >
                     Ver más <SquareArrowOutUpRightIcon />
                  </Link>
               </div>
               {animes.length > 0 ? (
                  <Carousel
                     responsiveOptions={responsiveOptions}
                     value={animes}
                     numVisible={5}
                     numScroll={5}
                     itemTemplate={AnimeCard}
                     autoplayInterval={total > 5 ? 10000 : 0}
                     showIndicators={false}
                  />
               ) : (
                  <div className="w-full">
                     <img
                        alt="Not Found 404"
                        src="/not_results_found.png"
                        className="w-[15%] mx-auto"
                     />
                     <p className="text-sm font-semibold text-center">
                        {onlyFavs
                           ? "Aún no has agregado animes a favoritos. Puedes explorar por animes en búsqueda de nuevas experiencias."
                           : isEmision
                           ? "Actualmente no hay animes en emisión. Puedes explorar por animes finalizados en búsqueda de nuevas experiencias."
                           : "Lo sentimos.No hay animes que concuerden con la búsqueda. Puedes explorar por animes en búsqueda de nuevas experiencias."}
                     </p>
                     <Link
                        to="/explore/animes"
                        className="flex flex-row  btn-link w-fit mx-auto"
                     >
                        Ver más <SquareArrowOutUpRightIcon />
                     </Link>
                  </div>
               )}
            </>
         )}
      </div>
   );
}
