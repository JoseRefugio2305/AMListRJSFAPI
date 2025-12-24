import { authStore } from "../../../store/authStore";
import type { StatusViewEnum } from "../../../types/animeTypes";
import { getColorTipoAnimeManga, getMangaStrType } from "../../../utils/common";
import { FavButton } from "../../Common/FavButon";
import { StatusViewDropDown } from "../../Common/StatusViewDropDown";
import { Rating, RatingStar } from "flowbite-react";
import { Link } from "react-router";
import { BookOpen, SquareArrowOutUpRightIcon } from "lucide-react";
import type { TipoMangaEnum } from "../../../types/mangaTypes";

interface MoreInfoProps {
   id: string;
   tipo: TipoMangaEnum;
   publicando: number;
   fechaComienzoPub: string;
   fechaFinPub: string | undefined;
   calificacion: number;
   numRatings: number;
   link_p: string;
   linkMAL: string;
   capitulos: number;
   volumenes: number;
   fav_status: boolean;
   setFav: React.Dispatch<React.SetStateAction<boolean>>;
   statusView: StatusViewEnum;
   setStatusView: React.Dispatch<React.SetStateAction<number>>;
}

export function MoreInfoManga({
   id,
   tipo,
   publicando,
   fechaComienzoPub,
   fechaFinPub,
   calificacion,
   numRatings,
   linkMAL,
   link_p,
   capitulos,
   volumenes,
   fav_status,
   setFav,
   statusView,
   setStatusView,
}: MoreInfoProps) {
   const username = authStore((s) => s.username);
   return (
      //TODO: Color de emision de detalles
      <>
         <h5
            className={`rounded-sm py-2 text-lg justify-center flex text-white  font-semibold ${getColorTipoAnimeManga(
               tipo,
               1
            )}`}
         >
            {publicando === 1 ? "En Publicación" : "Finalizado"}
         </h5>
         <h5
            className={`rounded-sm py-2 text-lg justify-center flex text-white  font-semibold ${getColorTipoAnimeManga(
               tipo,
               0
            )}`}
         >
            {getMangaStrType(tipo)}
         </h5>
         {username && (
            <>
               <FavButton
                  is_anime={false}
                  fav_id={id}
                  fav_status={fav_status}
                  setFav={setFav}
                  className=""
               />
               {fav_status && (
                  <StatusViewDropDown
                     is_anime={false}
                     fav_id={id}
                     statusView={statusView}
                     setStatusView={setStatusView}
                  />
               )}
            </>
         )}

         <p className="text-md">
            <b>Fecha de Publicación:</b> {fechaComienzoPub}
         </p>
         {fechaFinPub !== "None" && (
            <p className="text-md">
               <b>Fecha de Finalización:</b> {fechaFinPub}
            </p>
         )}
         <p className="text-md">
            <b>Capítulos:</b>{" "}
            {!capitulos || capitulos === 0 ? "Desconocidos" : capitulos}
         </p>
         <p className="text-md">
            <b>Volumenes:</b>{" "}
            {!volumenes || volumenes === 0 ? "Desconocidos" : volumenes}
         </p>
         <Rating size="lg">
            <RatingStar filled={Math.floor(calificacion / 2) >= 1} />
            <RatingStar filled={Math.floor(calificacion / 2) >= 2} />
            <RatingStar filled={Math.floor(calificacion / 2) >= 3} />
            <RatingStar filled={Math.floor(calificacion / 2) >= 4} />
            <RatingStar filled={Math.floor(calificacion / 2) == 5} />
            <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
            <p className="ml-2 text-md font-bold text-gray-900 dark:text-white">
               {calificacion}
            </p>
         </Rating>
         <p className="text-md">
            <b>Num. de Votos:</b> {numRatings}
         </p>
         <Link
            target="_blank"
            to={link_p}
            className="hover:underline hover:text-white font-semibold text-md bg-yellow-500 rounded-sm px-2 py-1 w-full flex justify-center gap-3 items-center"
         >
            <BookOpen size={40} /> Lectura Gratuita{" "}
            <SquareArrowOutUpRightIcon size={16} />
         </Link>
         <Link
            target="_blank"
            to={linkMAL}
            className="hover:underline hover:text-white font-semibold text-md bg-blue-500 rounded-sm px-2 py-1 w-full flex justify-center gap-3 items-center"
         >
            <img src="/MAL.svg" className="w-[15%]" /> Página de MAL{" "}
            <SquareArrowOutUpRightIcon size={16} />
         </Link>
      </>
   );
}
