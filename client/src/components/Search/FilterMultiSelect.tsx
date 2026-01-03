import { MultiSelect, type MultiSelectChangeEvent } from "primereact/multiselect";
import type { FilterObjSchema } from "../../schemas/filtersSchemas";

export function FilterMultiSelect<T>({
   id,
   value,
   options,
   onChange,
   placeholder,
   className = "md:w-full mb-2 min-w-0 w-60",
}: {
   id: string;
   value: FilterObjSchema[];
   options: T[];
   onChange: (e: MultiSelectChangeEvent) => void;
   placeholder?: string;
   className?: string;
}) {
   const footerTemplate = (selectedF: FilterObjSchema[]) => {
      const length = selectedF.length;

      return (
         <div className="py-2 px-3">
            <b>{length > 0 ? length : ""}</b>
            {length > 1
               ? " opciones seleccionadas."
               : length === 0
               ? ""
               : " opción seleccionada."}
         </div>
      );
   };

   return (
      <MultiSelect
         id={id}
         value={value}
         options={options}
         onChange={onChange}
         optionLabel="name"
         placeholder={placeholder}
         panelFooterTemplate={() => footerTemplate(value)}
         className={className}
         display="chip"
      />
   );
}
