import { Accordion, AccordionTab } from "primereact/accordion";

interface TitulosAltProps {
   titulos_alt:
      | [
           {
              tit_alt: string;
              tipo: string;
           }
        ]
      | [];
}
export function TitulosAlt({ titulos_alt }: TitulosAltProps) {
   return (
      <Accordion className="shadow-2xl my-2 bg-white dark:bg-gray-800">
         <AccordionTab header="Títulos Alternativos">
            <div className="text-sm font-bold">
               {titulos_alt.map((tit_al, idx) => (
                  <p key={idx}>{tit_al.tit_alt + " | " + tit_al.tipo}</p>
               ))}
            </div>
         </AccordionTab>
      </Accordion>
   );
}
