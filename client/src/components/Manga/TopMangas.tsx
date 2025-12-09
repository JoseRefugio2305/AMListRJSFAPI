import { useEffect, useState } from "react";
import { FieldOrdEnum } from "../../types/filterTypes";
import { LazyLoadImage } from "../Common/LazyLoadImage";
import { cutText } from "../../utils/common";
import { Link } from "react-router";
import { TopSkeleton } from "../Skeletons/TopSkeleton";
import type { Manga } from "../../types/mangaTypes";
import { getMangas } from "../../services/mangaServices";

export function TopMangas() {
   const [mangas, setMangas] = useState<[Manga] | []>([]);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      getMangas("/manga/", {
         limit: 5,
         page: 1,
         emision: 3,
         orderBy: -1,
         orderField: FieldOrdEnum.calificacion,
      })
         .then((resp) => {
            setMangas(resp.listaMangas ?? []);
         })
         .catch((error) => {
            console.error(error);
         })
         .finally(() => setLoading(false));
   }, []);

   return (
      <div className="w-full  md:w-[45%] md:ml-[10%]  md:h-full">
         <h2 className="text-xl font-bold">Top Mangas</h2>
         {loading ? (
            <TopSkeleton />
         ) : (
            mangas.map((manga, idx) => (
               <div
                  className="flex flex-row shadow-2xl gap-4 hover:scale-98 rounded-xl"
                  key={manga.id}
               >
                  <div className="flex justify-center items-center w-[10%]">
                     <p className="text-7xl font-bold ml-[30%]">{idx + 1}</p>
                  </div>
                  <LazyLoadImage
                    //  src={manga.mangaImages.img}
                      src="default_image.jpg"
                     alt={cutText(manga.titulo, 35)}
                     className="h-25 w-20 rounded-xl"
                  />
                  <div>
                     <Link
                        to="/login" //TODO: Crear pagina de detalles de manga
                        className="hover:underline hover:text-purple-600"
                     >
                        <h5 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white hover:text-purple-600">
                           {cutText(manga.titulo, 50)}
                        </h5>
                     </Link>
                     <p className="font-normal text-gray-700 dark:text-gray-400">
                        Episodios: {manga.capitulos}
                        <br />
                        Calificación: {manga.calificacion}
                        <br />
                        Num. ratings: {manga.numRatings}
                     </p>
                  </div>
               </div>
            ))
         )}
      </div>
   );
}
