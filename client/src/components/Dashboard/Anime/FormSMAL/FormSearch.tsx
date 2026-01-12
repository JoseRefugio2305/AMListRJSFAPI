import {
   ArrowLeft,
   ArrowRight,
   Search,
   SquareArrowOutUpRightIcon,
} from "lucide-react";
import type { AnimeIncompleteSchema } from "../../../../schemas/animeSchemas";
import { Link } from "react-router";
import { Button, TextInput } from "flowbite-react";
import type { RefObject } from "react";

interface FormSearchProps {
   loading: boolean;
   loadingMAL: boolean;
   setLoadingMAL: (load: boolean) => void;
   currentAnime: AnimeIncompleteSchema | null;
   animesToAct: number;
   titSearch: RefObject<HTMLInputElement | null>;
   currentIdx: number;
   fetchFromMAL: (change: boolean) => void;
   nextprevAnime: (idx: number) => void;
   lengthAIncom: number;
}

export function FormSearch({
   loading,
   loadingMAL,
   setLoadingMAL,
   currentAnime,
   animesToAct,
   titSearch,
   currentIdx,
   fetchFromMAL,
   nextprevAnime,
   lengthAIncom,
}: FormSearchProps) {
   return (
      !loading &&
      currentAnime && (
         <div className="w-full flex flex-col gap-1">
            <p className="font-semibold text-sm">
               Animes a Actualizar: {animesToAct}
            </p>
            <p className="font-semibold text-md text-center">Anime Actual</p>
            <p className="font-semibold text-sm">
               Key Anime: {currentAnime.key_anime}
            </p>
            <p className="font-semibold text-sm">
               Título: {currentAnime.titulo}
            </p>

            <p className="font-semibold text-sm text-blue-500 underline">
               <Link
                  to={currentAnime.link_p}
                  target="_blank"
                  className="flex flex-row"
               >
                  Visitar Página P. <SquareArrowOutUpRightIcon size={16} />
               </Link>
            </p>
            <div className="flex md:flex-row gap-2 flex-col w-full ">
               <TextInput
                  ref={titSearch}
                  name="title_search"
                  type="text"
                  icon={Search}
                  className="w-full md:w-[80%] mb-1"
                  disabled={loadingMAL}
                  placeholder="Ingresa el Título a buscar"
               />
               <Button
                  color="purple"
                  className="w-full md:w-[20%] mb-3 shrink-0"
                  type="button"
                  onClick={() => {
                     setLoadingMAL(true);
                     fetchFromMAL(false);
                  }}
                  disabled={loadingMAL}
               >
                  Buscar
               </Button>
            </div>
            {lengthAIncom > 1 && (
               <div className="flex md:flex-row md:gap-2 flex-col w-full">
                  <Button
                     color="purple"
                     className="w-full md:w-[50%] mb-3 shrink-0 flex flex-row gap-5"
                     onClick={() => nextprevAnime(currentIdx - 1)}
                     disabled={loadingMAL}
                  >
                     <ArrowLeft /> Anterior
                  </Button>
                  <Button
                     color="purple"
                     className="w-full md:w-[50%] mb-3 shrink-0 flex flex-row gap-5"
                     onClick={() => nextprevAnime(currentIdx + 1)}
                     disabled={loadingMAL}
                  >
                     Siguiente <ArrowRight />
                  </Button>
               </div>
            )}
         </div>
      )
   );
}
