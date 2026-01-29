import { Label, TextInput } from "flowbite-react";
import type { AnimeImagesSharedSchema } from "../../../../schemas/relationsSchemas";

interface ImagesSectionFormProps {
   animeImages: AnimeImagesSharedSchema;
}

export function ImagesSectionForm({ animeImages }: ImagesSectionFormProps) {
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
               placeholder="Imágen pequeña del Anime"
               defaultValue={animeImages.img_sm}
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
               placeholder="Imágen normal del Anime"
               defaultValue={animeImages.img}
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
               placeholder="Imágen grande del Anime"
               defaultValue={animeImages.img_l}
               required
            />
         </div>
      </>
   );
}
