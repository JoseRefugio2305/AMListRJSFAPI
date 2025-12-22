import { useEffect, useState } from "react";
import { getAnimes } from "../../services/animeServices";
import { FieldOrdEnum } from "../../types/filterTypes";
import { LazyLoadImage } from "../Common/LazyLoadImage";
import { cutText, getTitleForLink } from "../../utils/common";
import { Link } from "react-router";
import { TopSkeleton } from "../Skeletons/TopSkeleton";
import type { AnimeSchema } from "../../schemas/animeSchemas";

export function TopAnimes() {
   const [animes, setAnimes] = useState<AnimeSchema[]>([]);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      getAnimes("/anime/", {
         limit: 5,
         page: 1,
         emision: 3,
         orderBy: -1,
         orderField: FieldOrdEnum.calificacion,
      })
         .then((resp) => {
            setAnimes(resp.listaAnimes ?? []);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setLoading(false));
   }, []);

   return (
      <div className="w-full  md:w-[45%] md:h-full">
         <h2 className="text-xl font-bold">Top Animes</h2>
         {loading ? (
            <TopSkeleton />
         ) : (
            animes.map((anime, idx) => (
               <div
                  className="flex flex-row shadow-2xl gap-4 hover:scale-98 rounded-xl mb-1"
                  key={anime.id}
               >
                  <div className="flex justify-center items-center w-[10%]">
                     <p className="text-7xl font-bold ml-[30%]">{idx + 1}</p>
                  </div>
                  <LazyLoadImage
                     // src={anime.animeImages.img}
                     src="default_image.jpg"
                     alt={cutText(anime.titulo, 35)}
                     className="h-25 w-20 rounded-xl"
                  />
                  <div>
                     <Link
                        to={`/anime/${getTitleForLink(anime.titulo)}/${
                           anime.key_anime
                        }`}
                        className="hover:underline hover:text-purple-600"
                     >
                        <h5 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white hover:text-purple-600">
                           {cutText(anime.titulo, 30)}
                        </h5>
                     </Link>
                     <p className="font-normal text-gray-700 dark:text-gray-400">
                        Episodios: {anime.episodios}
                        <br />
                        Calificación: {anime.calificacion}
                        <br />
                        Num. ratings: {anime.numRatings}
                     </p>
                  </div>
               </div>
            ))
         )}
      </div>
   );
}
