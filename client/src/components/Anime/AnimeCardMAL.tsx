import type { AnimeMALSearchSchema } from "../../schemas/animeSchemas";
import { cutText } from "../../utils/common";
import { LazyLoadImage } from "../Common/LazyLoadImage";
import { Link } from "react-router";
import { Button, Tooltip } from "flowbite-react";
import { CircleCheckIcon, SquareArrowOutUpRightIcon } from "lucide-react";

interface AnimeCardMALProps {
   anime: AnimeMALSearchSchema;
   callbackHandleIDMAL: (idMAL: number) => void;
}

export function AnimeCardMAL({
   anime,
   callbackHandleIDMAL,
}: AnimeCardMALProps) {
   return (
      <div className="w-full  border-b border-t hover:bg-gray-400 duration-300 hover:scale-95 dark:hover:bg-gray-600 hover:border-0 hover:rounded-2xl hover:text-white">
         <div className="flex flex-col sm:flex-row md:items-start p-4 gap-3">
            <LazyLoadImage
               // src={anime.image ?? "default_image.jpg"}
               src="default_image.jpg"
               alt={anime.titulo}
               className=" w-[20%] h-[60%] rounded-2xl"
            />
            <div className="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-4 w-full md:w-[70%]">
               <div className="flex flex-col items-center sm:items-start gap-2">
                  <Link
                     target="_blank"
                     to={anime.linkMAL}
                     className=" hover:underline hover:text-purple-500"
                  >
                     <h5 className="flex flex-row text-xl font-bold text-900 gap-0">
                        {cutText(anime.titulo, 100)}{" "}
                        <SquareArrowOutUpRightIcon />
                     </h5>
                  </Link>

                  <div className="flex flex-col items-center gap-3">
                     <span className="flex items-center gap-2">
                        <h5 className="w-full font-bold text-white rounded-full p-1 bg-violet-500 px-3">
                           {anime.tipo}
                        </h5>
                     </span>
                  </div>
               </div>
               <div className="flex sm:flex-col align-middle sm:items-end gap-3 sm:gap-2 ">
                  <Tooltip
                     content={`Asignar el ID MAL ${anime.id_MAL}`}
                     animation="duration-150"
                  >
                     <Button
                        onClick={() => callbackHandleIDMAL(anime.id_MAL)}
                        color="purple"
                        className="rounded-full"
                     >
                        <CircleCheckIcon />
                     </Button>
                  </Tooltip>
               </div>
            </div>
         </div>
      </div>
   );
}
