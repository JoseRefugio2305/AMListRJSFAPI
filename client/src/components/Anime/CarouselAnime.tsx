import { useEffect, useState } from "react";
import { Link } from "react-router";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import type { Anime } from "../../types/animeTypes";
import { getAnimes } from "../../services/animeServices";
import { CarouselSkeleton } from "../Skeletons/CarouselSkeleton";
import { Carousel } from "primereact/carousel";
import { AnimeCard } from "./AnimeCard";

export function CarouselAnime() {
   const [animes, setAnimes] = useState<[Anime] | []>([]);
   const [total, setTotalAnimes] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      getAnimes("/anime/emision/", { limit: 20, page: 1, emision: 1 })
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
                  <h2 className="text-xl font-bold">Animes en Emisión</h2>
                  <Link
                     to="/search/emision" //TODO: Construir pagina de busqueda/exploracion y que reciba parametros de busqueda en ruta
                     className="flex flex-row btn-link"
                  >
                     Ver mas <SquareArrowOutUpRightIcon />
                  </Link>
               </div>
               <Carousel
                  responsiveOptions={responsiveOptions}
                  value={animes}
                  numVisible={5}
                  numScroll={5}
                  itemTemplate={AnimeCard}
                  autoplayInterval={total > 5 ? 10000 : 0}
                  showIndicators={false}
               />
            </>
         )}
      </div>
   );
}
