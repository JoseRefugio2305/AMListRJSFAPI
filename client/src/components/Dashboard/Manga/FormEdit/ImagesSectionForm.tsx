import { Label, TextInput } from "flowbite-react";
import type { MangaImagesSharedSchema } from "../../../../schemas/relationsSchemas";

interface ImagesSectionFormProps {
   mangaImages: MangaImagesSharedSchema;
}

export function ImagesSectionForm({ mangaImages }: ImagesSectionFormProps) {
   return (
      <>
         <h2 className="text-2xl font-bold">Imágenes</h2>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="imgsm">
                  Imágen pequeña:
               </Label>
            </div>
            <TextInput
               id="imgsm"
               name="imgsm"
               type="text"
               placeholder="Imágen pequeña del Manga"
               defaultValue={mangaImages.img_sm}
               required
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="img">
                  Imágen normal:
               </Label>
            </div>
            <TextInput
               id="img"
               name="img"
               type="text"
               placeholder="Imágen normal del Manga"
               defaultValue={mangaImages.img}
               required
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label className="font-bold" htmlFor="imglg">
                  Imágen grande:
               </Label>
            </div>
            <TextInput
               id="imglg"
               name="imglg"
               type="text"
               placeholder="Imágen grande del Manga"
               defaultValue={mangaImages.img_l}
               required
            />
         </div>
      </>
   );
}
