import { useCallback, useEffect, useRef, useState } from "react";
import type { ModalProps } from "../Anime/ModalFormCreate";
import { toastStore } from "../../../store/toastStore";
import type { MangaIncompleteSchema } from "../../../schemas/mangaSchemas";
import type { AnimeMALSearchSchema } from "../../../schemas/animeSchemas";
import {  getIncompleteMangas, getMangasFromMAL } from "../../../services/searchServices";
import { SearchOnMALZ } from "../../../schemas/searchSchemas";
import { asignMangaIDMAL } from "../../../services/dashboardMangaServices";
import { Button, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { FormSearchMal } from "./FormSearchMAL";
import { SearchMALSkeleton } from "../../Skeletons/SearchMALSkeleton";
import { ScrollPanel } from "primereact/scrollpanel";
import { MangaCardMAL } from "../../Manga/MangaCardMAL";

export default function ModalFormSMAL({setOpenModal}:ModalProps){
      const showToast = toastStore((s) => s.showToast);
     
        const [loading, setLoading] = useState<boolean>(true);
        const [loadingMAL, setLoadingMAL] = useState<boolean>(true);
        const [mangasIncomplete, setMangasIncomplete] = useState<
           MangaIncompleteSchema[]
        >([]);
        const [mangasToAct, setMangasToAct] = useState<number>(0);
        const [currentManga, setCurrentManga] =
           useState<MangaIncompleteSchema | null>(null);
        const [mangasFromMAL, setMangasFromMAL] = useState<AnimeMALSearchSchema[]>(
           []
        );
        const [currentIdx, setCurrenIdx] = useState<number>(0);
        const titSearch = useRef<HTMLInputElement>(null);
     
        const fetchAnimes = () => {
           getIncompleteMangas({ limit: 20, page: 1 }, 0)
              .then((resp) => {
               console.log(resp)
                 if (!resp.is_success) {
                    showToast({
                       severity: "error",
                       summary: "Error",
                       detail: resp.msg,
                    });
                    setLoading(false);
                    return;
                 }
     
                 if (!resp.listaMangas || resp.listaMangas?.length === 0) {
                    showToast({
                       severity: "info",
                       summary: "Mensaje",
                       detail: "Actualmente no hay mangas a actualizar.",
                    });
                    setOpenModal(false);
                    setLoading(false);
                    return;
                 }
     
                 setMangasIncomplete(resp.listaMangas ?? []);
                 setMangasToAct(resp.totalMangas ?? 0);
                 setCurrentManga(resp.listaMangas ? resp.listaMangas[0] : null);
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
           if (mangasIncomplete.length === 0) {
              fetchAnimes();
           }
        }, [mangasIncomplete]);
     
        const fetchFromMAL = useCallback(
           (isChange: boolean = false) => {
              if (!currentManga) return;
     
              let textTitSearch = currentManga.titulo;
              if (titSearch.current && isChange) {
                 titSearch.current.value = currentManga.titulo;
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
                 getMangasFromMAL(parsed.data)
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
                       if (!resp.listaMangas || resp.totalResults === 0) {
                          showToast({
                             severity: "info",
                             summary: "Mensaje",
                             detail: "No hay animes que correspondan a la búsqueda.",
                          });
                          setLoadingMAL(false);
                          return;
                       }
                       setMangasFromMAL(resp.listaMangas ?? []);
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
                       setMangasFromMAL([]);
                       setLoadingMAL(false);
                    });
              }
           },
           [currentManga]
        );
     
        useEffect(() => {
           const loadingMAL = () => {
              setLoadingMAL(true);
           };
           loadingMAL();
           fetchFromMAL(true);
        }, [fetchFromMAL]);
     
        const nextprevManga = (idxAnime: number) => {
           const lengthAnimes = mangasIncomplete.length;
           if (idxAnime < lengthAnimes && idxAnime >= 0) {
              setCurrentManga(mangasIncomplete[idxAnime]);
              setCurrenIdx(idxAnime);
           } else if (idxAnime === lengthAnimes) {
              setCurrentManga(mangasIncomplete[0]);
              setCurrenIdx(0);
           } else {
              setCurrentManga(mangasIncomplete[lengthAnimes - 1]);
              setCurrenIdx(lengthAnimes - 1);
           }
        };
     
        const handleAsignIDMAL = (idMAL: number) => {
           if (currentManga?.id) {
              setLoadingMAL(true);
              asignMangaIDMAL({ id: currentManga.id, id_MAL: idMAL })
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
                    const new_incomplete = mangasIncomplete.filter(
                       (ain) => ain.id !== currentManga.id
                    );
                    setMangasIncomplete(new_incomplete);
                    if (new_incomplete.length > 0) {
                       nextprevManga(currentIdx + 1);
                    }
                    setMangasToAct(mangasToAct - 1);
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
           <>
              <ModalHeader>Asignar ID MAL a Animes</ModalHeader>
              <ModalBody>
                 <FormSearchMal
                    loading={loading}
                    loadingMAL={loadingMAL}
                    setLoadingMAL={setLoadingMAL}
                    currentManga={currentManga}
                    mangasToAct={mangasToAct}
                    titSearch={titSearch}
                    currentIdx={currentIdx}
                    fetchFromMAL={fetchFromMAL}
                    fetchMangas={fetchAnimes}
                    nextprevManga={nextprevManga}
                    lengthMIncom={mangasIncomplete.length}
                 />
                 {loadingMAL || loading ? (
                    <SearchMALSkeleton />
                 ) : (
                    <ScrollPanel
                       style={{ width: "100%", height: "200px" }}
                       className="custombar1"
                    >
                       <div className="grid md:grid-cols-2 grid-cols-1  gap-0">
                          {mangasFromMAL.map((manga: AnimeMALSearchSchema) => (
                             <MangaCardMAL
                                manga={manga}
                                callbackHandleIDMAL={handleAsignIDMAL}
                                key={manga.id_MAL}
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
           </>
        );
}