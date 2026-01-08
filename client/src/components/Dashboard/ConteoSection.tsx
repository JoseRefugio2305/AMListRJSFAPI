import {
   BookHeartIcon,
   BookImageIcon,
   Brush,
   Database,
   LaptopMinimal,
   TvMinimalPlayIcon,
   UserPenIcon,
   Users,
} from "lucide-react";
import type { FullStatsSchema } from "../../schemas/statsSchemas";

interface ConteoSectionProps {
   conteos: FullStatsSchema | null;
}

export function ConteoSection({ conteos }: ConteoSectionProps) {
   return (
      <div className="w-auto flex flex-col gap-5 shadow-2xl md:rounded-2xl rounded-none dark:bg-gray-700 bg-gray-200 p-6 my-4">
         <h3 className="text-xl font-bold text-center flex flex-row gap-4 mx-auto">
            <Database /> Conteos Generales
         </h3>
         <div className="w-full flex flex-col lg:flex-row gap-4">
            <div className="w-full flex flex-col md:flex-row gap-4">
               <p className="hover:text-purple-600 hover:underline hover:scale-95 text-lg font-bold text-center flex flex-row gap-4 mx-auto align-middle">
                  <Users /> Usuarios: {conteos?.totalUsuarios}
               </p>
               <p className="hover:text-purple-600 hover:underline hover:scale-95 text-lg font-bold text-center flex flex-row gap-4 mx-auto align-middle">
                  <TvMinimalPlayIcon /> Animes: {conteos?.totalAnimes}
               </p>
               <p className="hover:text-purple-600 hover:underline hover:scale-95 text-lg font-bold text-center flex flex-row gap-4 mx-auto align-middle">
                  <LaptopMinimal /> Estudios: {conteos?.totalStdAnime}
               </p>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-4">
               <p className="hover:text-purple-600 hover:underline hover:scale-95 text-lg font-bold text-center flex flex-row gap-4 mx-auto align-middle">
                  <Brush /> Mangas: {conteos?.totalMangas}
               </p>
               <p className="hover:text-purple-600 hover:underline hover:scale-95 text-lg font-bold text-center flex flex-row gap-4 mx-auto align-middle">
                  <BookImageIcon /> Editoriales: {conteos?.totalEdtManga}
               </p>
               <p className="hover:text-purple-600 hover:underline hover:scale-95 text-lg font-bold text-center flex flex-row gap-4 mx-auto align-middle">
                  <UserPenIcon /> Autores: {conteos?.totalAutoresMangas}
               </p>
               <p className="hover:text-purple-600 hover:underline hover:scale-95 text-lg font-bold text-center flex flex-row gap-4 mx-auto align-middle">
                  <BookHeartIcon /> Generos: {conteos?.totalGeneros}
               </p>
            </div>
         </div>
      </div>
   );
}
