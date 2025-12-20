import { useState } from "react";
import { cutText } from "../../../utils/common";

interface DescriptionProps {
   descripcion: string;
}
export function Description({ descripcion }: DescriptionProps) {
   const [isExpanded, setIsExpanded] = useState<boolean>(false);
   const handleToggle = () => setIsExpanded((s) => !s);

   return (
      <>
         <h2 className="text-lg font-bold">Sinopsis</h2>
         <p className="text-sm">
            {isExpanded ? descripcion : cutText(descripcion, 150)}
            {descripcion.length > 150 && (
               <button
                  type="button"
                  onClick={handleToggle}
                  className="ml-2 p-0 border-0 bg-transparent text-blue-600 dark:text-blue-400 cursor-pointer underline text-sm hover:text-blue-800 dark:hover:text-blue-200"
               >
                  {isExpanded ? "Ver menos" : "Ver más"}
               </button>
            )}
         </p>
      </>
   );
}
