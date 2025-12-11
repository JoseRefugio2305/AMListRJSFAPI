import { type Anime } from "../../types/animeTypes";
import {
   cutText,
   getAnimeStrType,
   getColorTipoAnimeManga,
   getDayEmision,
} from "../../utils/common";
import { LazyLoadImage } from "../Common/LazyLoadImage";
import { Link } from "react-router";
import { useState } from "react";
import { FavButton } from "../Common/FavButon";

export const AnimeCard = (anime: Anime) => {
   const [fav_status, setFav] = useState<boolean>(anime.isFav ?? false);

   return (
      <div className="group perspective:1000px mx-4 cursor-pointer">
         {/* Contenedor interno que rota */}
         <div className="relative h-full w-full transition-all duration-500 transform-3d group-hover:transform-[rotateY(180deg)] group-hover:scale-95 card-am">
            {/* Cara frontal de la tarjeta */}
            <div className="absolute inset-0 rounded-2xl shadow-xl backface-hidden flex items-center justify-center p-4">
               <FavButton
                  is_anime={true}
                  fav_id={anime.id}
                  fav_status={fav_status}
                  setFav={setFav}
                  className="absolute inset-0 flex ml-5 mt-10 justify-center w-fit"
               />
               <LazyLoadImage
                  height={315}
                  // src={anime.animeImages.img}
                  src="default_image.jpg"
                  alt={cutText(anime.titulo, 35)}
                  className="img-card"
               />
               <h5
                  className={`emision-day ${getColorTipoAnimeManga(
                     anime.tipo,
                     anime.emision
                  )}`}
               >
                  {anime.emision === 1
                     ? getDayEmision(anime.fechaEmision)
                     : getAnimeStrType(anime.tipo)}
               </h5>
               <Link
                  to="/login" //TODO: Crear pagina de detalles de anime
                  className="link-card"
               >
                  <h5 className="title-card bg-black/50  bg-opacity-50">
                     {cutText(anime.titulo, 35)}
                  </h5>
               </Link>
            </div>

            {/* Cara trasera de la tarjeta */}
            <div className="absolute inset-0 rounded-2xl shadow-xl backface-hidden rotate-y-180 items-center justify-center p-4 bg-black">
               <FavButton
                  is_anime={true}
                  fav_id={anime.id}
                  fav_status={fav_status}
                  setFav={setFav}
               />
               <Link
                  to="/login" //TODO: Crear pagina de detalles de anime
                  className="link-card"
               >
                  <h5 className="title-card">{cutText(anime.titulo, 35)}</h5>
               </Link>

               <p className="text-white">{cutText(anime.descripcion, 50)}</p>
               <br />
               <p className="text-white">
                  <b>Episodios:</b> {anime.episodios}
               </p>
            </div>
         </div>
      </div>
      // <div
      //    onClick={() => navigate("/login")} //TODO: Crear pagina de detalles de anime
      //    className="card-am"
      // >
      //    <LazyLoadImage
      //       height={315}
      //       // src={anime.animeImages.img}
      //       src="/148347.jpg"
      //       alt={anime.titulo}
      //       className="img-card"
      //    />
      //    <Link
      //       to="/login" //TODO: Crear pagina de detalles de anime
      //       className="link-card"
      //    >
      //       <h5 className="title-card bg-black/50  bg-opacity-50">
      //          {cutText(anime.titulo, 35)}
      //       </h5>
      //    </Link>
      // </div>
   );
};
