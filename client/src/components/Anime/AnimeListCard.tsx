import { useState } from "react";
import type { AnimeSchema } from "../../schemas/animeSchemas";
import {
   cutText,
   getAnimeStrType,
   getColorTipoAnimeManga,
   getDayEmision,
   getTitleForLink,
} from "../../utils/common";
import { FavButton } from "../Common/FavButon";
import { LazyLoadImage } from "../Common/LazyLoadImage";
import { Link } from "react-router";
import { Rating, RatingStar } from "flowbite-react";
import { SquareArrowOutUpRightIcon } from "lucide-react";

export const AnimeListCard = (anime: AnimeSchema) => {
   const [fav_status, setFav] = useState<boolean>(anime.isFav ?? false);
   return (
      <div
         className="w-full border-b border-t hover:bg-gray-400 duration-300 hover:scale-95 dark:hover:bg-gray-700 hover:border-0 hover:rounded-2xl hover:text-white"
         key={anime.id}
      >
         <div className="flex flex-col sm:flex-row md:items-start p-4 gap-4">
            <div className="flex w-full md:w-[30%] items-center justify-center">
               <LazyLoadImage
                  src={anime.animeImages.img}
                  // src="default_image.jpg"
                  alt={anime.titulo}
                  className="w-[70%] sm:w-[60%] md:w-[45%] rounded-2xl"
               />
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-4 w-full md:w-[50%]">
               <div className="flex flex-col items-center sm:items-start gap-3">
                  <Link
                     to={`/anime/${getTitleForLink(anime.titulo)}/${
                        anime.key_anime
                     }`}
                     className=" hover:underline hover:text-purple-500"
                  >
                     <h5 className="flex flex-row text-2xl font-bold text-900">
                        {cutText(anime.titulo, 100)}{" "}
                        <SquareArrowOutUpRightIcon />
                     </h5>
                  </Link>

                  <div className="flex flex-col items-center gap-3">
                     <span className="flex items-center gap-2">
                        <h5
                           className={`w-full font-bold text-white rounded-2xl p-1 ${getColorTipoAnimeManga(
                              anime.tipo,
                              0
                           )}`}
                        >
                           {getAnimeStrType(anime.tipo)}
                        </h5>
                        <h5
                           className={`w-full font-bold text-white rounded-2xl p-1 ${
                              anime.emision === 1
                                 ? getColorTipoAnimeManga(
                                      anime.tipo,
                                      anime.emision
                                   )
                                 : "bg-red-600"
                           }`}
                        >
                           {anime.emision === 1
                              ? getDayEmision(anime.fechaEmision)
                              : "Finalizado"}
                        </h5>
                     </span>
                  </div>
                  <div>
                     <Rating size="lg">
                        <RatingStar
                           filled={Math.floor(anime.calificacion / 2) >= 1}
                        />
                        <RatingStar
                           filled={Math.floor(anime.calificacion / 2) >= 2}
                        />
                        <RatingStar
                           filled={Math.floor(anime.calificacion / 2) >= 3}
                        />
                        <RatingStar
                           filled={Math.floor(anime.calificacion / 2) >= 4}
                        />
                        <RatingStar
                           filled={Math.floor(anime.calificacion / 2) == 5}
                        />
                        <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
                        <p className="ml-2 text-md font-bold text-gray-900 dark:text-white">
                           {anime.calificacion}
                        </p>
                     </Rating>
                  </div>
               </div>
               <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 ">
                  <span className="text-lg font-semibold">
                     Episodios:{" "}
                     {anime.episodios > 0 ? anime.episodios : "Desconocidos"}
                  </span>
                  <FavButton
                     is_anime={true}
                     fav_id={anime.id}
                     fav_status={fav_status}
                     setFav={setFav}
                     className="z-20"
                  />
               </div>
            </div>
         </div>
      </div>
   );
};
