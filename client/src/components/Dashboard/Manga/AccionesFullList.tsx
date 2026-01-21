import { Tooltip } from "flowbite-react";
import { Link } from "react-router";
import { getTitleForLink } from "../../../utils/common";
import { PencilIcon, SquareArrowOutUpRightIcon } from "lucide-react";
import type { MangaSchema } from "../../../schemas/mangaSchemas";
import { BtnDeleteManga } from "./BtnDeleteManga";

interface AccionesFullListProps {
   manga: MangaSchema;
   callBackDel: <T>(...args: T[]) => void;
}

export function AccionesFullList({
   manga,
   callBackDel,
}: AccionesFullListProps) {
   return (
      <>
         <div className="flex flex-row gap-3">
            <Tooltip
               content="Visitar Detalles de Manga"
               animation="duration-150"
               placement="right"
            >
               <Link
                  to={`/manga/${getTitleForLink(manga.titulo)}/${
                     manga.key_manga
                  }`}
                  target="_blank"
                  className="text-white font-bold text-sm m-1 bg-purple-500 rounded-full px-3 py-3 flex w-fit"
               >
                  <SquareArrowOutUpRightIcon />
               </Link>
            </Tooltip>
            <Tooltip
               content="Editar Información del Manga"
               animation="duration-150"
               placement="right"
            >
               <Link
                  to={`/manga/${getTitleForLink(manga.titulo)}/${
                     manga.key_manga
                  }`} //TODO: Crear pagina d edicion de manga
                  target="_blank"
                  className="text-white font-bold text-sm m-1 bg-yellow-400 rounded-full px-3 py-3 flex w-fit"
               >
                  <PencilIcon />
               </Link>
            </Tooltip>
            <Tooltip
               content="Eliminar el Manga"
               animation="duration-150"
               placement="right"
            >
               <BtnDeleteManga
                  mangaId={manga.id}
                  mangaTitulo={manga.titulo}
                  callBackDel={callBackDel}
               />
            </Tooltip>
         </div>
      </>
   );
}
