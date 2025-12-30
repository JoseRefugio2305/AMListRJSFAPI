import { useEffect, useState } from "react";
import { Carousel } from "primereact/carousel";
import { Link } from "react-router";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { getMangas } from "../../services/mangaServices";
import { CarouselSkeleton } from "../Skeletons/CarouselSkeleton";
import { MangaCard } from "./MangaCard";
import type { MangaSchema } from "../../schemas/mangaSchemas";

export function CarouselManga() {
   const [mangas, setMangas] = useState<MangaSchema[]>([]);
   const [total, setTotalMangas] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      getMangas("/manga/publicando/", { limit: 20, page: 1, emision: 1 })
         .then((resp) => {
            setMangas(resp.listaMangas ?? []);
            setTotalMangas(resp.totalMangas ?? 0);
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
                  <h2 className="text-xl font-bold">Mangas en Publicación</h2>
                  <Link
                     to="/explore/mangas?emision=1"
                     className="flex flex-row btn-link"
                  >
                     Ver mas <SquareArrowOutUpRightIcon />
                  </Link>
               </div>
               <Carousel
                  responsiveOptions={responsiveOptions}
                  value={mangas}
                  numVisible={5}
                  numScroll={5}
                  itemTemplate={MangaCard}
                  autoplayInterval={total > 5 ? 10000 : 0}
               />
            </>
         )}
      </div>
   );
}
