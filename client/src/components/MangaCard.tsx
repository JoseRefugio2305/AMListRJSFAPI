import { cutText, getDayEmision } from "../utils/common";
import { LazyLoadImage } from "./LazyLoadImage";
import { Link } from "react-router";
import { useState } from "react";
import { FavButton } from "./FavButon";
import type { Manga } from "../types/mangaTypes";

export const MangaCard = (manga: Manga) => {
   const [fav_status, setFav] = useState<boolean>(manga.isFav ?? false);

   return (
      <div className="group perspective:1000px mx-4 cursor-pointer">
         {/* Contenedor interno que rota */}
         <div className="relative h-full w-full transition-all duration-500 transform-3d group-hover:transform-[rotateY(180deg)] group-hover:scale-95 card-am">
            {/* Cara frontal de la tarjeta */}
            <div className="absolute inset-0 rounded-2xl shadow-xl backface-hidden flex items-center justify-center p-4">
               <FavButton
                  is_anime={false}
                  fav_id={manga.id}
                  fav_status={fav_status}
                  setFav={setFav}
                  className="absolute inset-0 flex ml-5 mt-10 justify-center w-fit"
               />
               <LazyLoadImage
                  height={315}
                  // src={manga.mangaImages.img}
                  src="default_image.jpg"
                  alt={cutText(manga.titulo, 35)}
                  className="img-card"
               />
               {manga.publicando && (
                  <h5 className="emision-day">
                     {getDayEmision(manga.fechaComienzoPub)}
                  </h5>
               )}
               <Link
                  to="/login" //TODO: Crear pagina de detalles de manga
                  className="link-card"
               >
                  <h5 className="title-card bg-black/50  bg-opacity-50">
                     {cutText(manga.titulo, 35)}
                  </h5>
               </Link>
            </div>

            {/* Cara trasera de la tarjeta */}
            <div className="absolute inset-0 rounded-2xl shadow-xl backface-hidden rotate-y-180 items-center justify-center p-4 bg-black">
               <FavButton
                  is_anime={false}
                  fav_id={manga.id}
                  fav_status={fav_status}
                  setFav={setFav}
               />
               <Link
                  to="/login" //TODO: Crear pagina de detalles de manga
                  className="link-card"
               >
                  <h5 className="title-card">{cutText(manga.titulo, 35)}</h5>
               </Link>

               <p className="text-white">{cutText(manga.descripcion, 50)}</p>
               <br />
               <p className="text-white">
                  <b>Capitulos:</b> {manga.capitulos}
               </p>
            </div>
         </div>
      </div>
   );
};
