interface NotRFProps {
   message: string;
}
export function NotResultsFound({ message }: NotRFProps) {
   return (
      <div className="grid justify-center p-10">
         <img alt="Sin resultados por mostrar" src="/not_results_found.png" />
         <p className="text-lg font-bold">{message}</p>
      </div>
   );
}
