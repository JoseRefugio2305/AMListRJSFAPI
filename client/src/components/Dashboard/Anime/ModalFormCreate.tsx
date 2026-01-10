import {
   Button,
   Label,
   Modal,
   ModalBody,
   ModalFooter,
   ModalHeader,
   TextInput,
} from "flowbite-react";
import { Dropdown } from "primereact/dropdown";
import { useId, useState, type FormEvent } from "react";
import { optionsTipoAnime } from "../../../types/animeTypes";
import type { OptionsSelectInterface } from "../../../types/filterTypes";
import { AnimeCreateZ } from "../../../schemas/animeSchemas";
import { toastStore } from "../../../store/toastStore";
import { isNumber, parseStringNumber } from "../../../utils/parse";
import { createAnime } from "../../../services/dashboardAnimeServides";

export interface ModalProps {
   openModal: boolean;
   setOpenModal: (open: boolean) => void;
}

export function ModalFormCreate({ openModal, setOpenModal }: ModalProps) {
   const idSelTipo = useId();
   const [selTipo, setSelTipo] = useState<OptionsSelectInterface | null>(null);
   const [loading, setLoading] = useState<boolean>(false);

   const showToast = toastStore((s) => s.showToast);

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!selTipo) return;
      const formData = new FormData(event.currentTarget);
      const key_anime_str = formData.get("key_anime") ?? "1";
      if (!isNumber(String(key_anime_str))) {
         showToast({
            severity: "error",
            summary: "Error",
            detail: "El Key Anime debe ser un numero entero.",
         });
         return;
      }
      const key_anime = parseStringNumber(String(key_anime_str ?? "1"));
      const titulo = String(formData.get("titulo") ?? "");
      const link_p = String(formData.get("link_p") ?? "");
      const tipo = selTipo.code;
      
      setLoading(true);
      const parsed = AnimeCreateZ.safeParse({
         key_anime,
         titulo,
         link_p,
         tipo,
      });
      
      if (!parsed.success) {
         showToast({
            severity: "error",
            summary: "Error",
            detail: parsed.error.issues[0].message,
         });
         setLoading(false);
         return;
      } else {
         createAnime(parsed.data)
         .then((resp) => {
               showToast({
                  severity: resp.is_success ? "success" : "error",
                  summary: resp.is_success ? "Exito" : "Error",
                  detail: resp.message,
               });
               setOpenModal(false);
               setLoading(false);
               if (resp.is_success) {
                  setSelTipo(null);
               }
            })
            .catch((error) => {
               console.error(error);
               showToast({
                  severity: "error",
                  summary: "Error",
                  detail: "Ocurrio un error al procesar la petición.",
               });
               setLoading(false);
            });
      }
   };
   return (
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
         <ModalHeader>Crear Anime</ModalHeader>
         <form onSubmit={handleSubmit}>
            <ModalBody>
               <div className="space-y-6">
                  <div>
                     <div className="mb-2 block">
                        <Label htmlFor="key_anime">
                           Key Anime (numero entero):{" "}
                        </Label>
                     </div>
                     <TextInput
                        id="key_anime"
                        name="key_anime"
                        type="text"
                        placeholder="Key Anime"
                        required
                     />
                  </div>
                  <div>
                     <div className="mb-2 block">
                        <Label htmlFor="titulo">Titulo: </Label>
                     </div>
                     <TextInput
                        id="titulo"
                        name="titulo"
                        type="text"
                        placeholder="Titulo"
                        required
                     />
                  </div>
                  <div>
                     <div className="mb-2 block">
                        <Label htmlFor="link_p">
                           Link Streaming Gratuito:{" "}
                        </Label>
                     </div>
                     <TextInput
                        id="link_p"
                        name="link_p"
                        type="text"
                        placeholder="Link Streaming Gratuito"
                        required
                     />
                  </div>
                  <div>
                     <div className="mb-2 block">
                        <Label>Tipo de Anime: </Label>
                     </div>
                     <Dropdown
                        value={selTipo}
                        onChange={(e) => setSelTipo(e.value)}
                        options={optionsTipoAnime}
                        optionLabel="name"
                        showClear
                        placeholder="Selecciona un tipo de anime..."
                        className="w-full mb-2 min-w-0"
                        id={idSelTipo}
                     />
                  </div>
               </div>
            </ModalBody>
            <ModalFooter className="justify-end">
               <Button color="purple" type="submit" disabled={loading}>
                  Crear
               </Button>
               <Button color="red" onClick={() => setOpenModal(false)}>
                  Cancelar
               </Button>
            </ModalFooter>
         </form>
      </Modal>
   );
}
