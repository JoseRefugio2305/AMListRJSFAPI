import { SquareArrowOutUpRightIcon } from "lucide-react";
import { Link } from "react-router";
import { TipoContenidoEnum } from "../../../types/filterTypes";

interface MessageProps {
   typeCont: TipoContenidoEnum;
}

export function MessageNoContenido({ typeCont }: MessageProps) {
   const ruta = `/explore/${
      typeCont === TipoContenidoEnum.anime
         ? "anime"
         : typeCont === TipoContenidoEnum.manga
         ? "manga"
         : ""
   }`;
   const message =
      typeCont === TipoContenidoEnum.anime
         ? "animes"
         : typeCont === TipoContenidoEnum.manga
         ? "mangas"
         : "contenido";

   return (
      <div>
         <img
            alt="Not Found 404"
            src="/not_results_found.png"
            className="w-[15%] mx-auto"
         />
         <p className="text-sm font-semibold text-center">
            {`Aún no se han agregado ${message}. Puedes explorar por ${message} en
            búsqueda de nuevas experiencias.`}
         </p>
         <Link to={ruta} className="flex flex-row  btn-link w-fit mx-auto">
            Explorar <SquareArrowOutUpRightIcon />
         </Link>
      </div>
   );
}
