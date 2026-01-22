import { Tooltip } from "flowbite-react";
import { Link } from "react-router";
import type { GSAESchema } from "../../../schemas/gsaeSchema";
import { SquareArrowOutUpRightIcon } from "lucide-react";

interface AccionesGenerosListProps {
   genero: GSAESchema;
   callBackDel: <T>(...args: T[]) => void;
}

export function AccionesGenerosList({
   genero,
   callBackDel,
}: AccionesGenerosListProps) {
   return (
      <>
         <div className="flex flex-row gap-3">
            <Tooltip
               content="Visitar Página MAL"
               animation="duration-150"
               placement="right"
            >
               <Link
                  to={genero.linkMAL}
                  target="_blank"
                  className="text-white font-bold text-sm m-1 bg-blue-500 rounded-full px-3 py-3 flex w-fit"
               >
                  <SquareArrowOutUpRightIcon />
               </Link>
            </Tooltip>
            <Tooltip
               content="Explorar Contenido Con este Género"
               animation="duration-150"
               placement="right"
            >
               <Link
                  to={`/explore/animes?genres=${genero.id_MAL}`}
                  target="_blank"
                  className="text-white font-bold text-sm m-1 bg-purple-500 rounded-full px-3 py-3 flex w-fit"
               >
                  <SquareArrowOutUpRightIcon />
               </Link>
            </Tooltip>
         </div>
      </>
   );
}
