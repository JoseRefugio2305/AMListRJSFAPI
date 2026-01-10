import { Button, MegaMenu, NavbarCollapse, NavbarToggle } from "flowbite-react";
import {
   CloudUploadIcon,
   DiamondPlusIcon,
   FilePlus,
   SearchSlashIcon,
} from "lucide-react";
import { useState } from "react";
import { ModalFormCreate } from "./ModalFormCreate";

export function MenuAnimeList() {
   const [oModalCreate, setOModalCreate] = useState<boolean>(false);

   return (
      <>
         <MegaMenu className="lex justify-between w-full shadow-2xl rounded-2xl">
            <NavbarToggle />
            <NavbarCollapse>
               <Button
                  className="bg-purple-600 hover:underline mb-2"
                  color="purple"
                  onClick={() => setOModalCreate(true)}
               >
                  <DiamondPlusIcon className="mr-2" />
                  Crear Anime
               </Button>
               <Button
                  className="bg-purple-600 hover:underline mb-2"
                  color="purple"
               >
                  <FilePlus className="mr-2" />
                  Agregar desde Archivo
               </Button>
               <Button
                  className="bg-purple-600 hover:underline mb-2"
                  color="purple"
               >
                  <SearchSlashIcon className="mr-2" />
                  Buscar en MAL
               </Button>
               <Button
                  className="bg-purple-600 hover:underline mb-2"
                  color="purple"
               >
                  <CloudUploadIcon className="mr-2" />
                  Actualizar desde MAL
               </Button>
            </NavbarCollapse>
         </MegaMenu>

         <ModalFormCreate
            openModal={oModalCreate}
            setOpenModal={setOModalCreate}
         />
      </>
   );
}
