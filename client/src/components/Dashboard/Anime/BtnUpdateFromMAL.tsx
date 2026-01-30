import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { CircleAlert, UploadCloudIcon } from "lucide-react";
import { useState } from "react";
import { toastStore } from "../../../store/toastStore";
import { cutText } from "../../../utils/common";
import { updateAnimeFromMAL } from "../../../services/dashboardAnimeServides";

interface BtnUpdateFromMALProps {
   animeId: string;
   animeTitulo: string;
}

export function BtnUpdateFromMAL({
   animeId,
   animeTitulo,
}: BtnUpdateFromMALProps) {
   const showToast = toastStore((s) => s.showToast);
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const handleUpdateMAL = () => {
      setLoading(true);
      showToast({
         severity: "info",
         summary: "Info",
         detail: "Actualizando Anime Espere...",
      });
      updateAnimeFromMAL(animeId)
         .then((resp) => {
            if (!resp.is_success) {
               setLoading(false);
            }
            showToast({
               severity: resp.is_success ? "success" : "error",
               summary: resp.is_success ? "Info" : "Error",
               detail: resp.message,
            });
            setOpenModal(false);
         })
         .catch((error) => {
            console.error(error);
            showToast({
               severity: "error",
               summary: "Error",
               detail: "Error al intentar actualizar el anime.",
            });
            setLoading(false);
         });
   };
   return (
      <>
         <Button
            className="text-white font-bold text-sm m-1 rounded-full px-3 py-6 flex w-fit cursor-pointer"
            onClick={() => {
               setOpenModal(true);
            }}
            disabled={loading}
         >
            <UploadCloudIcon />
         </Button>
         <Modal
            show={openModal}
            size="md"
            onClose={() => setOpenModal(false)}
            popup
         >
            <ModalHeader />
            <ModalBody>
               <div className="text-center">
                  <CircleAlert className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                     ¿Estás seguro de querer actualizar desde MAL el Anime{" "}
                     {cutText(animeTitulo, 50)}?
                  </h3>
                  <div className="flex justify-center gap-4">
                     <Button
                        color="blue"
                        onClick={() => {
                           handleUpdateMAL();
                        }}
                        disabled={loading}
                     >
                        Actualizar
                     </Button>
                     <Button
                        disabled={loading}
                        color="alternative"
                        onClick={() => {
                           showToast({
                              severity: "info",
                              summary: "Info",
                              detail: "Se cancelo la acción.",
                           });
                           setOpenModal(false);
                        }}
                     >
                        Cancelar
                     </Button>
                  </div>
               </div>
            </ModalBody>
         </Modal>
      </>
   );
}
