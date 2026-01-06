import { useEffect, useState } from "react";
import { Carousel } from "primereact/carousel";
import { Link } from "react-router";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { getMangas } from "../../services/mangaServices";
import { CarouselSkeleton } from "../Skeletons/CarouselSkeleton";
import { MangaCard } from "./MangaCard";
import type { MangaSchema } from "../../schemas/mangaSchemas";

interface CarouselMangaProps {
   isPublicacion: boolean;
   onlyFavs: boolean;
   username: string;
   isOwnProfile: boolean;
}

export function CarouselManga({
   isPublicacion,
   onlyFavs,
   username,
   isOwnProfile,
}: CarouselMangaProps) {
   const [mangas, setMangas] = useState<MangaSchema[]>([]);
   const [total, setTotalMangas] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(true);
   const rutaPeticion = isPublicacion
      ? "manga/publicando/"
      : onlyFavs
      ? `user/manga_list/${username.toLowerCase()}`
      : "manga/";

   useEffect(() => {
      getMangas(rutaPeticion, {
         limit: 20,
         page: 1,
         emision: isPublicacion ? 1 : 3,
         onlyFavs,
      })
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
                  <h2 className="text-xl font-bold">
                     Mangas{" "}
                     {isPublicacion
                        ? "en Publicación"
                        : onlyFavs
                        ? "en Favoritos"
                        : ""}
                  </h2>
                  <Link
                     to={
                        isPublicacion
                           ? "/explore/mangas?emision=1"
                           : onlyFavs
                           ? `/user/${username}/mangalist`
                           : "/explore/mangas?emision=3"
                     }
                     className="flex flex-row btn-link"
                  >
                     Ver más <SquareArrowOutUpRightIcon />
                  </Link>
               </div>
               {mangas.length > 0 ? (
                  mangas.length > 2 ? (
                     <Carousel
                        responsiveOptions={responsiveOptions}
                        value={mangas}
                        numVisible={5}
                        numScroll={5}
                        itemTemplate={MangaCard}
                        autoplayInterval={total > 5 ? 10000 : 0}
                        showIndicators={false}
                     />
                  ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                        {mangas.map((manga) => (
                           <MangaCard key={manga.key_manga} {...manga} />
                        ))}
                     </div>
                  )
               ) : (
                  <div className="w-full">
                     <img
                        alt="Not Found 404"
                        src="/not_results_found.png"
                        className="w-[15%] mx-auto"
                     />
                     <p className="text-sm font-semibold text-center">
                        {onlyFavs
                           ? `${
                                isOwnProfile
                                   ? "Aún no has"
                                   : "El usuario aún no ha"
                             } agregado mangas a favoritos. Puedes explorar por mangas en búsqueda de nuevas experiencias.`
                           : isPublicacion
                           ? "Actualmente no hay mangas en publicación. Puedes explorar por mangas finalizados en búsqueda de nuevas experiencias."
                           : "Lo sentimos.No hay mangas que concuerden con la búsqueda. Puedes explorar por mangas en búsqueda de nuevas experiencias."}
                     </p>
                     <Link
                        to="/explore/mangas"
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
