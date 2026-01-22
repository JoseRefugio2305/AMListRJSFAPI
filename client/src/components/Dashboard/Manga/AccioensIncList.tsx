import { Tooltip } from "flowbite-react";
import { Link } from "react-router";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import type { MangaIncompleteSchema } from "../../../schemas/mangaSchemas";
import { BtnDeleteManga } from "./BtnDeleteManga";

interface AccionesIncListProps {
   mangaInc: MangaIncompleteSchema;
   callBackDel: <T>(...args: T[]) => void;
}

export function AccionesIncList({
   mangaInc,
   callBackDel,
}: AccionesIncListProps) {
   return (
      <>
         <div className="flex flex-row gap-3">
            <Tooltip
               content="Visitar Página P."
               animation="duration-150"
               placement="right"
            >
               <Link
                  to={mangaInc.link_p}
                  target="_blank"
                  className="text-white font-bold text-sm m-1 bg-purple-500 rounded-full px-3 py-3 flex w-fit"
               >
                  <SquareArrowOutUpRightIcon />
               </Link>
            </Tooltip>
            <Tooltip
               content="Eliminar el Manga"
               animation="duration-150"
               placement="right"
            >
               <BtnDeleteManga
                  mangaId={mangaInc.id}
                  mangaTitulo={mangaInc.titulo}
                  callBackDel={callBackDel}
               />
            </Tooltip>
         </div>
      </>
   );
}
