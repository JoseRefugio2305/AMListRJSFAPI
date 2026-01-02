import { Link } from "react-router";
import type { FavsCountSchema } from "../../schemas/statsSchemas";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { StatsSViewFavs } from "../User/StatsSViewFavs";

interface ChartsTypeAMProps {
   dataStats: FavsCountSchema | null;
}

export function ChartsTypeAM({ dataStats }: ChartsTypeAMProps) {
   return (
      <div className="flex flex-col w-full p-5">
         <div className="w-full">
            {dataStats?.totalAnimes && dataStats?.totalAnimes > 0 ? (
               <>
                  <h3 className="text-xl font-semibold text-center">
                     Estadísticas de Animes
                  </h3>
                  <p className="text-md font-semibold">
                     Animes en favoritos: {dataStats.totalAnimes}
                  </p>
                  <StatsSViewFavs
                     dataStats={dataStats?.conteos_statusA ?? []}
                     areAnimes={true}
                  />
               </>
            ) : (
               <>
                  <img
                     alt="Not Found 404"
                     src="/not_results_found.png"
                     className="w-[15%] mx-auto"
                  />
                  <p className="text-sm font-semibold text-center">
                     Aún no se han agregado animes a favoritos. Puedes explorar
                     por animes en búsqueda de nuevas experiencias.
                  </p>
                  <Link
                     to="/explore/animes"
                     className="flex flex-row  btn-link w-fit mx-auto"
                  >
                     Explorar <SquareArrowOutUpRightIcon />
                  </Link>
               </>
            )}
         </div>
         <div className="w-full">
            {dataStats?.totalMangas && dataStats?.totalMangas > 0 ? (
               <>
                  <h3 className="text-xl font-semibold text-center">
                     Estadísticas de Mangas
                  </h3>
                  <p className="text-md font-semibold">
                     Mangas en favoritos: {dataStats.totalMangas}
                  </p>
                  <StatsSViewFavs
                     dataStats={dataStats?.conteos_statusM ?? []}
                     areAnimes={false}
                  />
               </>
            ) : (
               <>
                  <img
                     alt="Not Found 404"
                     src="/not_results_found.png"
                     className="w-[15%] mx-auto"
                  />
                  <p className="text-sm font-semibold text-center">
                     Aún no se han agregado mangas a favoritos. Puedes explorar
                     por mangas en búsqueda de nuevas experiencias.
                  </p>
                  <Link
                     to="/explore/mangas"
                     className="flex flex-row  btn-link w-fit mx-auto"
                  >
                     Explorar <SquareArrowOutUpRightIcon />
                  </Link>
               </>
            )}
         </div>
      </div>
   );
}
