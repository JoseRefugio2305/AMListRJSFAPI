import { Tooltip } from "flowbite-react";
import type { AnimeSchema } from "../../../schemas/animeSchemas";
import { Link } from "react-router";
import { getTitleForLink } from "../../../utils/common";
import { PencilIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import { BtnDeleteAnime } from "./BtnDeleteAnime";

interface AccionesFullListProps {
   anime: AnimeSchema;
   callBackDel: <T>(...args: T[]) => void;
}

export function AccionesFullList({
   anime,
   callBackDel,
}: AccionesFullListProps) {
   return (
      <>
         <div className="flex flex-row gap-3">
            <Tooltip
               content="Visitar Detalles de Anime"
               animation="duration-150"
               placement="right"
            >
               <Link
                  to={`/anime/${getTitleForLink(anime.titulo)}/${
                     anime.key_anime
                  }`}
                  target="_blank"
                  className="text-white font-bold text-sm m-1 bg-purple-500 rounded-full px-3 py-3 flex w-fit"
               >
                  <SquareArrowOutUpRightIcon />
               </Link>
            </Tooltip>
            <Tooltip
               content="Editar Información del Anime"
               animation="duration-150"
               placement="right"
            >
               <Link
                  to={`/anime/${getTitleForLink(anime.titulo)}/${
                     anime.key_anime
                  }`} //TODO: Crear pagina d edicion de anime
                  target="_blank"
                  className="text-white font-bold text-sm m-1 bg-yellow-400 rounded-full px-3 py-3 flex w-fit"
               >
                  <PencilIcon />
               </Link>
            </Tooltip>
            <Tooltip
               content="Eliminar el Anime"
               animation="duration-150"
               placement="right"
            >
               <BtnDeleteAnime
                  animeId={anime.id}
                  animeTitulo={anime.titulo}
                  callBackDel={callBackDel}
               />
            </Tooltip>
         </div>
      </>
   );
}
