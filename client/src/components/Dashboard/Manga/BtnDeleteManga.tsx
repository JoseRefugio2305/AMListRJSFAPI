import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { cutText } from "../../../utils/common";
import { CircleAlert, Trash2Icon } from "lucide-react";
import { toastStore } from "../../../store/toastStore";
import { useState } from "react";
import { deleteManga } from "../../../services/dashboardMangaServices";

interface BtnDeleteMangaProps {
   mangaId: string;
   mangaTitulo: string;
   callBackDel: <T>(...args: T[]) => void;
}

export function BtnDeleteManga({
   mangaId,
   mangaTitulo,
   callBackDel,
}: BtnDeleteMangaProps) {
   const showToast = toastStore((s) => s.showToast);
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const handleDelete = () => {
      showToast({
         severity: "warn",
         summary: "Info",
         detail: "Se esta eliminando el Manga Espere.",
      });
      setLoading(true);
      deleteManga(mangaId)
         .then((resp) => {
            showToast({
               severity: resp.is_success ? "success" : "error",
               summary: resp.is_success ? "Exito" : "Error",
               detail: resp.message,
            });
            callBackDel();
            setOpenModal(false);
            setLoading(false);
         })
         .catch((error) => {
            console.error(error);
            showToast({
               severity: "error",
               summary: "Error",
               detail: "Error al intentar eliminar el manga.",
            });
            setOpenModal(false);
            setLoading(false);
         });
   };

   return (
      <>
         <Button
            onClick={() => {
               setOpenModal(true);
            }}
            color="danger"
            className="text-white font-bold text-sm m-1 bg-red-600 rounded-full px-3 py-6 flex w-fit cursor-pointer"
         >
            <Trash2Icon />
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
                     ¿Estás seguro de querer eliminar el Manga
                     {cutText(mangaTitulo, 50)}?
                  </h3>
                  <div className="flex justify-center gap-4">
                     <Button
                        color="red"
                        onClick={() => {
                           handleDelete();
                        }}
                        disabled={loading}
                     >
                        Aceptar
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
