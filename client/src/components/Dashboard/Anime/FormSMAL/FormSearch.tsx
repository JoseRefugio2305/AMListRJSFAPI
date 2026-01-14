import {
   ArrowLeft,
   ArrowRight,
   Search,
   SquareArrowOutUpRightIcon,
} from "lucide-react";
import type { AnimeIncompleteSchema } from "../../../../schemas/animeSchemas";
import { Link } from "react-router";
import { Button, TextInput, Tooltip } from "flowbite-react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { BtnDeleteAnime } from "../BtnDeleteAnime";

interface FormSearchProps {
   loading: boolean;
   loadingMAL: boolean;
   setLoadingMAL: Dispatch<SetStateAction<boolean>>;
   currentAnime: AnimeIncompleteSchema | null;
   animesToAct: number;
   titSearch: RefObject<HTMLInputElement | null>;
   currentIdx: number;
   fetchFromMAL: (change: boolean) => void;
   fetchAnimes: () => void;
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
   fetchAnimes,
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
            <div className="flex flex-col md:flex-row gap-1">
               <div className="w-full md:w-[70%]">
                  <p className="font-semibold text-sm">
                     Key Anime: {currentAnime.key_anime}
                  </p>
                  <p className="font-semibold text-sm">
                     Título: {currentAnime.titulo}
                  </p>
               </div>
               <div className="w-full md:w-[30%] flex flex-row gap-5 justify-center">
                  <Tooltip
                     content="Visitar Página P."
                     animation="duration-150"
                     placement="right"
                  >
                     <Link
                        to={currentAnime.link_p}
                        target="_blank"
                        className="text-white font-bold text-sm m-1 bg-blue-500 rounded-full px-3 py-3 flex w-fit"
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
                        animeId={currentAnime.id}
                        animeTitulo={currentAnime.titulo}
                        callBackDel={fetchAnimes}
                     />
                  </Tooltip>
               </div>
            </div>
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
