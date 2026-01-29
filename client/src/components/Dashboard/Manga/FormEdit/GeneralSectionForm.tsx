import { Datepicker, Label, Textarea, TextInput } from "flowbite-react";
import { Dropdown } from "primereact/dropdown";
import { useId, type Dispatch, type SetStateAction } from "react";
import {
   optionsEmision,
   type OptionsSelectInterface,
} from "../../../../types/filterTypes";
import type { MangaCompleteSchema } from "../../../../schemas/mangaSchemas";
import { optionsTipoManga } from "../../../../types/mangaTypes";

interface GeneralSectionFormProps {
   mangaData: MangaCompleteSchema;
   pubDate: Date | null;
   setPubDate: Dispatch<SetStateAction<Date | null>>;
   endPubDate: Date | null;
   setEndPubDate: Dispatch<SetStateAction<Date | null>>;
   selPubl: OptionsSelectInterface | null;
   setSelPubl: Dispatch<SetStateAction<OptionsSelectInterface | null>>;
   selTipoManga: OptionsSelectInterface | null;
   setSelTipoManga: Dispatch<SetStateAction<OptionsSelectInterface | null>>;
}

export function GeneralSectionForm({
   mangaData,
   pubDate,
   setPubDate,
   endPubDate,
   setEndPubDate,
   selPubl,
   setSelPubl,
   selTipoManga,
   setSelTipoManga,
}: GeneralSectionFormProps) {
   const idSelEmison = useId();
   const idSelTipoManga = useId();
   return (
      <>
         <h2 className="text-2xl font-bold">Información General</h2>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="titulo">
                  Titulo:
               </Label>
            </div>
            <TextInput
               id="titulo"
               name="titulo"
               type="text"
               placeholder="Título del Manga"
               defaultValue={mangaData.titulo}
               required
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="descripcion">
                  Descripción:
               </Label>
            </div>
            <Textarea
               id="descripcion"
               name="descripcion"
               placeholder="Descripción del Manga"
               defaultValue={mangaData.descripcion}
               required
               rows={10}
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="capitulos">
                  Capítulos:
               </Label>
            </div>
            <TextInput
               id="capitulos"
               name="capitulos"
               type="number"
               placeholder="Capítulos del Manga"
               defaultValue={mangaData.capitulos}
               required
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="volumenes">
                  Volumenes:
               </Label>
            </div>
            <TextInput
               id="volumenes"
               name="volumenes"
               type="number"
               placeholder="Volumenes del Manga"
               defaultValue={mangaData.volumenes}
               required
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="calificacion">
                  Calificación:
               </Label>
            </div>
            <TextInput
               id="calificacion"
               name="calificacion"
               type="number"
               placeholder="Calificación del Manga"
               defaultValue={mangaData.calificacion}
               step={0.1}
               required
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="numRatings">
                  Num. de Votos:
               </Label>
            </div>
            <TextInput
               id="numRatings"
               name="numRatings"
               type="number"
               placeholder="Num. de Votos del Manga"
               defaultValue={mangaData.numRatings}
               required
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="link_p">
                  Link Lectura Gratuita:
               </Label>
            </div>
            <TextInput
               id="link_p"
               name="link_p"
               type="text"
               placeholder="Link Streaming Gratuito del Manga"
               defaultValue={mangaData.link_p}
               required
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="linkMAL">
                  Link MAL:
               </Label>
            </div>
            <TextInput
               id="linkMAL"
               name="linkMAL"
               type="text"
               placeholder="Link MAL del Manga"
               defaultValue={mangaData.linkMAL}
               required
            />
         </div>
         <p className="font-bold">Fecha de Publicación:</p>
         <Datepicker
            language="es-MX"
            labelTodayButton="Hoy"
            labelClearButton="Limpiar"
            value={pubDate}
            onChange={setPubDate}
         />
         <p className="font-bold">Fecha de Fin de Publicación:</p>
         <Datepicker
            language="es-MX"
            labelTodayButton="Hoy"
            labelClearButton="Limpiar"
            value={endPubDate}
            onChange={setEndPubDate}
         />
         <p className="font-bold">Estado de Publicación:</p>
         <Dropdown
            value={selPubl}
            onChange={(e) => setSelPubl(e.value)}
            options={optionsEmision}
            optionLabel="name"
            showClear
            placeholder="Selecciona un estado de Publicación"
            className="w-full mb-2 min-w-0"
            id={idSelEmison}
         />
         <p className="font-bold">Tipo de Manga:</p>
         <Dropdown
            value={selTipoManga}
            onChange={(e) => setSelTipoManga(e.value)}
            options={optionsTipoManga}
            optionLabel="name"
            showClear
            placeholder="Selecciona un Tipo de Manga"
            className="w-full mb-2 min-w-0"
            id={idSelTipoManga}
         />
      </>
   );
}
