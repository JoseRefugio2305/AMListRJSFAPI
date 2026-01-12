import {
   Button,
   Modal,
   ModalBody,
   ModalFooter,
   ModalHeader,
} from "flowbite-react";
import type { ModalProps } from "./ModalFormCreate";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
   AnimeIncompleteSchema,
   AnimeMALSearchSchema,
} from "../../../schemas/animeSchemas";
import { SearchMALSkeleton } from "../../Skeletons/SearchMALSkeleton";
import {
   getAnimesFromMAL,
   getIncompleteAnimes,
} from "../../../services/searchServices";
import { toastStore } from "../../../store/toastStore";
import { ScrollPanel } from "primereact/scrollpanel";
import { SearchOnMALZ } from "../../../schemas/searchSchemas";
import { AnimeCardMAL } from "../../Anime/AnimeCardMAL";
import { asignAnimeIDMAL } from "../../../services/dashboardAnimeServides";
import { FormSearch } from "./FormSMAL/FormSearch";

export function ModalFormSMAL({ openModal, setOpenModal }: ModalProps) {
   const showToast = toastStore((s) => s.showToast);

   const [loading, setLoading] = useState<boolean>(true);
   const [loadingMAL, setLoadingMAL] = useState<boolean>(true);
   const [animesIncomplete, setAnimesIncomplete] = useState<
      AnimeIncompleteSchema[]
   >([]);
   const [animesToAct, setAnimesToAct] = useState<number>(0);
   const [currentAnime, setCurrentAnime] =
      useState<AnimeIncompleteSchema | null>(null);
   const [animesFromMAL, setAnimesFromMAL] = useState<AnimeMALSearchSchema[]>(
      []
   );
   const [currentIdx, setCurrenIdx] = useState<number>(0);
   const titSearch = useRef<HTMLInputElement>(null);

   const fetchAnimes = () => {
      getIncompleteAnimes({ limit: 20, page: 1 }, 0)
         .then((resp) => {
            if (!resp.is_success) {
               showToast({
                  severity: "error",
                  summary: "Error",
                  detail: resp.msg,
               });
               setLoading(false);
               return;
            }

            if (!resp.listaAnimes || resp.listaAnimes?.length === 0) {
               showToast({
                  severity: "info",
                  summary: "Mensaje",
                  detail: "Actualmente no hay animes a actualizar.",
               });
               setOpenModal(false);
               setLoading(false);
               return;
            }

            setAnimesIncomplete(resp.listaAnimes ?? []);
            setAnimesToAct(resp.totalAnimes ?? 0);
            setCurrentAnime(resp.listaAnimes ? resp.listaAnimes[0] : null);
            setCurrenIdx(0);
            setLoading(false);
         })
         .catch((error) => {
            console.error(error);
            showToast({
               severity: "error",
               summary: "Error",
               detail: "Error al intentar recuperar la data.",
            });
            setOpenModal(false);
            setCurrenIdx(0);
            setLoading(false);
         });
   };

   useEffect(() => {
      if (animesIncomplete.length === 0) {
         fetchAnimes();
      }
   }, [animesIncomplete]);

   const fetchFromMAL = useCallback(
      (isChange: boolean = false) => {
         if (!currentAnime) return;

         let textTitSearch = currentAnime.titulo;
         if (titSearch.current && isChange) {
            titSearch.current.value = currentAnime.titulo;
         }

         if (titSearch.current && titSearch.current.value.trim() !== "") {
            textTitSearch = titSearch.current.value;
         }

         const parsed = SearchOnMALZ.safeParse({
            tit_search: textTitSearch,
         });

         if (!parsed.success) {
            showToast({
               severity: "error",
               summary: "Error",
               detail: parsed.error.issues[0].message,
            });
            return;
         } else {
            getAnimesFromMAL(parsed.data)
               .then((resp) => {
                  if (!resp.is_success) {
                     showToast({
                        severity: "error",
                        summary: "Error",
                        detail: resp.msg,
                     });
                     setLoadingMAL(false);
                     return;
                  }
                  if (!resp.listaAnimes || resp.totalResults === 0) {
                     showToast({
                        severity: "info",
                        summary: "Mensaje",
                        detail: "No hay animes que correspondan a la búsqueda.",
                     });
                     setLoadingMAL(false);
                     return;
                  }
                  setAnimesFromMAL(resp.listaAnimes ?? []);
                  setLoadingMAL(false);
               })
               .catch((error) => {
                  console.error(error);
                  showToast({
                     severity: "error",
                     summary: "Error",
                     detail:
                        "Ocurrio un error al intentar recuperar los resultados.",
                  });
                  setAnimesFromMAL([]);
                  setLoadingMAL(false);
               });
         }
      },
      [currentAnime]
   );

   useEffect(() => {
      const loadingMAL = () => {
         setLoadingMAL(true);
      };
      loadingMAL();
      fetchFromMAL(true);
   }, [fetchFromMAL]);

   const nextprevAnime = (idxAnime: number) => {
      const lengthAnimes = animesIncomplete.length;
      if (idxAnime < lengthAnimes && idxAnime >= 0) {
         setCurrentAnime(animesIncomplete[idxAnime]);
         setCurrenIdx(idxAnime);
      } else if (idxAnime === lengthAnimes) {
         setCurrentAnime(animesIncomplete[0]);
         setCurrenIdx(0);
      } else {
         setCurrentAnime(animesIncomplete[lengthAnimes - 1]);
         setCurrenIdx(lengthAnimes - 1);
      }
   };

   const handleAsignIDMAL = (idMAL: number) => {
      if (currentAnime?.id) {
         setLoadingMAL(true);
         asignAnimeIDMAL({ id: currentAnime.id, id_MAL: idMAL })
            .then((resp) => {
               if (!resp.is_success) {
                  showToast({
                     severity: "error",
                     summary: "Error",
                     detail: resp.message,
                  });
                  setLoadingMAL(false);
                  return;
               }
               showToast({
                  severity: "success",
                  summary: "Exito",
                  detail: resp.message,
               });
               const new_incomplete = animesIncomplete.filter(
                  (ain) => ain.id !== currentAnime.id
               );
               setAnimesIncomplete(new_incomplete);
               if (new_incomplete.length > 0) {
                  nextprevAnime(currentIdx + 1);
               }
               setAnimesToAct(animesToAct - 1);
               setLoadingMAL(false);
            })
            .catch((error) => {
               console.error(error);
               showToast({
                  severity: "error",
                  summary: "Error",
                  detail: "Error al intentar asignar el ID MAL al Anime",
               });
               setLoadingMAL(false);
            });
      }
   };

   return (
      <Modal show={openModal} size="7xl" onClose={() => setOpenModal(false)}>
         <ModalHeader>Asignar ID MAL a Animes</ModalHeader>
         <ModalBody>
            <FormSearch
               loading={loading}
               loadingMAL={loadingMAL}
               setLoadingMAL={setLoadingMAL}
               currentAnime={currentAnime}
               animesToAct={animesToAct}
               titSearch={titSearch}
               currentIdx={currentIdx}
               fetchFromMAL={fetchFromMAL}
               nextprevAnime={nextprevAnime}
               lengthAIncom={animesIncomplete.length}
            />
            {loadingMAL || loading ? (
               <SearchMALSkeleton />
            ) : (
               <ScrollPanel
                  style={{ width: "100%", height: "200px" }}
                  className="custombar1"
               >
                  <div className="grid md:grid-cols-2 grid-cols-1  gap-0">
                     {animesFromMAL.map((anime: AnimeMALSearchSchema) => (
                        <AnimeCardMAL
                           anime={anime}
                           callbackHandleIDMAL={handleAsignIDMAL}
                           key={anime.id_MAL}
                        />
                     ))}
                  </div>
               </ScrollPanel>
            )}
         </ModalBody>
         <ModalFooter className="justify-end">
            <Button color="red" onClick={() => setOpenModal(false)}>
               Cerrar
            </Button>
         </ModalFooter>
      </Modal>
   );
}
