import { Button, ModalBody, ModalHeader } from "flowbite-react";
import { useEffect, useState } from "react";
import { getIncompleteMangas } from "../../../services/searchServices";
import { toastStore } from "../../../store/toastStore";
import { SearchMALSkeleton } from "../../Skeletons/SearchMALSkeleton";
import type { ModalProps } from "../Anime/ModalFormCreate";
import { updateAllMangas } from "../../../services/dashboardMangaServices";

export default function ModalUpdAll({ setOpenModal }: ModalProps) {
   const showToast = toastStore((s) => s.showToast);
   const [loading, setLoading] = useState<boolean>(true);
   const [totalToAct, setTotalToAct] = useState<number>(0);

   const fetchAnimes = () => {
      getIncompleteMangas({ limit: 1, page: 1 }, 1)
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

            setTotalToAct(resp.totalMangas ?? 0);
            setLoading(false);
         })
         .catch((error) => {
            console.error(error);
            showToast({
               severity: "error",
               summary: "Error",
               detail: "Error al intentar obtener la data.",
            });
            setOpenModal(false);
            setLoading(false);
         });
   };

   useEffect(() => {
      fetchAnimes();
   }, []);

   const handleUpd = () => {
      setLoading(true);
      updateAllMangas().then((resp) => {
         showToast({
            severity: resp.is_success ? "success" : "error",
            summary: resp.is_success ? "Exito" : "Error",
            detail: resp.message,
         });

         if (resp.is_success) setOpenModal(false);
         setTotalToAct(0);
         setLoading(false);
      });
   };

   return loading ? (
      <SearchMALSkeleton />
   ) : (
      <>
         <ModalHeader>Actualización de Mangas desde MAL</ModalHeader>
         <ModalBody>
            <div className="space-y-6 items-center justify-center flex flex-col">
               {totalToAct > 0 ? (
                  <>
                     <h2 className="text-2xl font-bold text-center">
                        Mangas Listos Para Actualizar
                     </h2>
                     <h3 className="text-6xl font-semibold text-center">
                        {totalToAct}
                     </h3>
                     <Button
                        color="purple"
                        className="rounded-full p-4"
                        onClick={handleUpd}
                     >
                        Actualizar Mangas
                     </Button>
                  </>
               ) : (
                  <h2 className="text-2xl font-bold text-center">
                     Actualmente No Hay Mangas Para Actualizar.
                  </h2>
               )}
            </div>
         </ModalBody>
      </>
   );
}
