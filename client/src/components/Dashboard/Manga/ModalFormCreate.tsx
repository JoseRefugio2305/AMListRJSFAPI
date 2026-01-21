import {
   Button,
   Label,
   ModalBody,
   ModalFooter,
   ModalHeader,
   TextInput,
} from "flowbite-react";
import type { ModalProps } from "../Anime/ModalFormCreate";
import { optionsTipoManga } from "../../../types/mangaTypes";
import { Dropdown } from "primereact/dropdown";
import { useId, useState, type FormEvent } from "react";
import { toastStore } from "../../../store/toastStore";
import type { OptionsSelectInterface } from "../../../types/filterTypes";
import { isNumber, parseStringNumber } from "../../../utils/parse";
import { MangaCreateZ } from "../../../schemas/mangaSchemas";
import { createManga } from "../../../services/dashboardMangaServices";

export default function ModalFormCreate({ setOpenModal }: ModalProps) {
   const idSelTipo = useId();
   const [selTipo, setSelTipo] = useState<OptionsSelectInterface | null>(null);
   const [loading, setLoading] = useState<boolean>(false);

   const showToast = toastStore((s) => s.showToast);

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!selTipo) return;
      const formData = new FormData(event.currentTarget);
      const key_manga_str = formData.get("key_manga") ?? "1";
      if (!isNumber(String(key_manga_str))) {
         showToast({
            severity: "error",
            summary: "Error",
            detail: "El Key Manga debe ser un numero entero.",
         });
         return;
      }
      const key_manga = parseStringNumber(String(key_manga_str ?? "1"));
      const titulo = String(formData.get("titulo") ?? "");
      const link_p = String(formData.get("link_p") ?? "");
      const tipo = selTipo.code;

      setLoading(true);
      const parsed = MangaCreateZ.safeParse({
         key_manga,
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
         createManga(parsed.data)
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
      <>
         <ModalHeader>Crear Anime</ModalHeader>
         <form onSubmit={handleSubmit}>
            <ModalBody>
               <div className="space-y-6">
                  <div>
                     <div className="mb-2 block">
                        <Label htmlFor="key_manga">
                           Key Manga (numero entero):
                        </Label>
                     </div>
                     <TextInput
                        id="key_manga"
                        name="key_manga"
                        type="text"
                        placeholder="Key Manga"
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
                           Link de Lectura Gratuita:
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
                        <Label>Tipo de Manga: </Label>
                     </div>
                     <Dropdown
                        value={selTipo}
                        onChange={(e) => setSelTipo(e.value)}
                        options={optionsTipoManga}
                        optionLabel="name"
                        showClear
                        placeholder="Selecciona un tipo de manga..."
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
      </>
   );
}
