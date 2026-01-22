import { Tooltip } from "flowbite-react";
import { Link } from "react-router";
import type { GSAESchema } from "../../../schemas/gsaeSchema";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { TipoGSAEEnum } from "../../../types/filterTypes";

interface AccionesGSAEListProps {
   gsae: GSAESchema;
   callBackDel: <T>(...args: T[]) => void;
   typeGSAE: TipoGSAEEnum;
}

export function AccionesGSAEList({
   gsae,
   callBackDel,
   typeGSAE,
}: AccionesGSAEListProps) {
   const ruta =
      typeGSAE === TipoGSAEEnum.generos
         ? "/explore?genres"
         : typeGSAE === TipoGSAEEnum.estudios
         ? "/explore/animes?studios"
         : typeGSAE === TipoGSAEEnum.editoriales
         ? "/explore/mangas?editorials"
         : "/explore/mangas?authors";
   return (
      <>
         <div className="flex flex-row gap-3">
            <Tooltip
               content="Visitar Página MAL"
               animation="duration-150"
               placement="right"
            >
               <Link
                  to={gsae.linkMAL}
                  target="_blank"
                  className="text-white font-bold text-sm m-1 bg-blue-500 rounded-full px-3 py-3 flex w-fit"
               >
                  <SquareArrowOutUpRightIcon />
               </Link>
            </Tooltip>
            <Tooltip
               content="Explorar Contenido En el Sistema"
               animation="duration-150"
               placement="right"
            >
               <Link
                  to={`${ruta}=${gsae.id_MAL}`}
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
