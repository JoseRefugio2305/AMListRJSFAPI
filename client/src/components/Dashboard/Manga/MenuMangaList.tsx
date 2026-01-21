import {
   Button,
   MegaMenu,
   Modal,
   NavbarCollapse,
   NavbarToggle,
} from "flowbite-react";
import {
   CloudUploadIcon,
   DiamondPlusIcon,
   SearchSlashIcon,
} from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { SearchMALSkeleton } from "../../Skeletons/SearchMALSkeleton.tsx";

const ModalFormCreate = lazy(() => import("./ModalFormCreate.tsx"));
const ModalFormSMAL = lazy(() => import("./ModalFormSMAL.tsx"));
const ModalUpdAll = lazy(() => import("./ModalUpdAll.tsx"));

export function MenuMangaList() {
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [formSel, setFormSel] = useState<number>(1);

   return (
      <>
         <MegaMenu className="lex justify-between w-full shadow-2xl rounded-2xl">
            <NavbarToggle />
            <NavbarCollapse>
               <Button
                  className="bg-purple-600 hover:underline mb-2"
                  color="purple"
                  onClick={() => {
                     setOpenModal(true);
                     setFormSel(1);
                  }}
               >
                  <DiamondPlusIcon className="mr-2" />
                  Crear Manga
               </Button>
               <Button
                  className="bg-purple-600 hover:underline mb-2"
                  color="purple"
                  onClick={() => {
                     setOpenModal(true);
                     setFormSel(2);
                  }}
               >
                  <SearchSlashIcon className="mr-2" />
                  Buscar en MAL
               </Button>
               <Button
                  className="bg-purple-600 hover:underline mb-2"
                  color="purple"
                  onClick={() => {
                     setOpenModal(true);
                     setFormSel(3);
                  }}
               >
                  <CloudUploadIcon className="mr-2" />
                  Actualizar desde MAL
               </Button>
            </NavbarCollapse>
         </MegaMenu>

         <Modal show={openModal} onClose={() => setOpenModal(false)} size="7xl">
            <Suspense fallback={<SearchMALSkeleton />}>
               {formSel === 1 ? (
                  <ModalFormCreate setOpenModal={setOpenModal} />
               ) : formSel === 2 ? (
                  <ModalFormSMAL setOpenModal={setOpenModal} />
               ) : (
                  <ModalUpdAll setOpenModal={setOpenModal} />
               )}
            </Suspense>
         </Modal>
      </>
   );
}
