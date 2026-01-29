import { Datepicker, Label, Textarea, TextInput } from "flowbite-react";
import type { AnimeCompleteSchema } from "../../../../schemas/animeSchemas";
import { Dropdown } from "primereact/dropdown";
import { useId, type Dispatch, type SetStateAction } from "react";
import {
   optionsEmision,
   type OptionsSelectInterface,
} from "../../../../types/filterTypes";
import { optionsTipoAnime } from "../../../../types/animeTypes";

interface GeneralSectionFormProps {
   animeData: AnimeCompleteSchema;
   emisionDate: Date | null;
   setEmisionDate: Dispatch<SetStateAction<Date | null>>;
   selEmision: OptionsSelectInterface | null;
   setSelEmision: Dispatch<SetStateAction<OptionsSelectInterface | null>>;
   selTipoAnime: OptionsSelectInterface | null;
   setSelTipoAnime: Dispatch<SetStateAction<OptionsSelectInterface | null>>;
}

export function GeneralSectionForm({
   animeData,
   emisionDate,
   setEmisionDate,
   selEmision,
   setSelEmision,
   selTipoAnime,
   setSelTipoAnime,
}: GeneralSectionFormProps) {
   const idSelEmison = useId();
   const idSelTipoAnime = useId();
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
               placeholder="Título del Anime"
               defaultValue={animeData.titulo}
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
               placeholder="Descripción del Anime"
               defaultValue={animeData.descripcion}
               required
               rows={10}
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="episodios">
                  Episodios:
               </Label>
            </div>
            <TextInput
               id="episodios"
               name="episodios"
               type="number"
               placeholder="Episodios del Anime"
               defaultValue={animeData.episodios}
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
               placeholder="Calificación del Anime"
               defaultValue={animeData.calificacion}
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
               placeholder="Num. de Votos del Anime"
               defaultValue={animeData.numRatings}
               required
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="link_p">
                  Link Streaming Gratuito:
               </Label>
            </div>
            <TextInput
               id="link_p"
               name="link_p"
               type="text"
               placeholder="Link Streaming Gratuito del Anime"
               defaultValue={animeData.link_p}
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
               placeholder="Link MAL del Anime"
               defaultValue={animeData.linkMAL}
               required
            />
         </div>
         <p className="font-bold">Fecha de Emisión:</p>
         <Datepicker
            language="es-MX"
            labelTodayButton="Hoy"
            labelClearButton="Limpiar"
            value={emisionDate}
            onChange={setEmisionDate}
         />
         <p className="font-bold">Estado de Emisión:</p>
         <Dropdown
            value={selEmision}
            onChange={(e) => setSelEmision(e.value)}
            options={optionsEmision}
            optionLabel="name"
            showClear
            placeholder="Selecciona un estado de Emisión"
            className="w-full mb-2 min-w-0"
            id={idSelEmison}
         />
         <p className="font-bold">Tipo de Anime:</p>
         <Dropdown
            value={selTipoAnime}
            onChange={(e) => setSelTipoAnime(e.value)}
            options={optionsTipoAnime}
            optionLabel="name"
            showClear
            placeholder="Selecciona un Tipo de Anime"
            className="w-full mb-2 min-w-0"
            id={idSelTipoAnime}
         />
      </>
   );
}
