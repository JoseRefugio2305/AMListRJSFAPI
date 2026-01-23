import { Tooltip } from "flowbite-react";
import type { AnimeIncompleteSchema } from "../../../schemas/animeSchemas";
import { Link } from "react-router";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { BtnDeleteAnime } from "./BtnDeleteAnime";

interface AccionesIncListProps {
   animeInc: AnimeIncompleteSchema;
   callBackDel: <T>(...args: T[]) => void;
}

export function AccionesIncList({
   animeInc,
   callBackDel,
}: AccionesIncListProps) {
   return (
      <>
         <div className="flex flex-row justify-between">
            <Tooltip
               content="Visitar Página P."
               animation="duration-150"
               placement="right"
            >
               <Link
                  to={animeInc.link_p}
                  target="_blank"
                  className="text-white font-bold text-sm m-1 bg-purple-500 rounded-full px-3 py-3 flex w-fit"
               >
                  <SquareArrowOutUpRightIcon />
               </Link>
            </Tooltip>
            <Tooltip
               content="Eliminar el Anime"
               animation="duration-150"
               placement="right"
            >
               <BtnDeleteAnime
                  animeId={animeInc.id}
                  animeTitulo={animeInc.titulo}
                  callBackDel={callBackDel}
               />
            </Tooltip>
         </div>
      </>
   );
}
