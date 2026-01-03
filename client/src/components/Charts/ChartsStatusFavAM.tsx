import type { FavsCountSchema } from "../../schemas/statsSchemas";
import { MessageNoContenido } from "../Common/User/MessageNoContenido";
import { StatsSViewFavs } from "../User/StatsSViewFavs";

interface ChartsStatusFavAMProps {
   dataStats: FavsCountSchema | null;
}

export function ChartsStatusFavAM({ dataStats }: ChartsStatusFavAMProps) {
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
               <MessageNoContenido typeCont={1} />
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
               <MessageNoContenido typeCont={2} />
            )}
         </div>
      </div>
   );
}
