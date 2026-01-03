import { SquareArrowOutUpRightIcon } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import type { FavsCountSchema } from "../../schemas/statsSchemas";
import { authStore } from "../../store/authStore";
import { getFavsStats } from "../../services/statsServices";
import { TypeStatsEnum } from "../../types/statsTypes";
import { ProfileStatsSkeleton } from "../Skeletons/ProfileStatsSkeleton";
import { ChartsStatusFavAM } from "../Charts/ChartsStatusFavAM";

interface StatsProfSecProps {
   name: string;
}

export function StatsProfileSection({ name }: StatsProfSecProps) {
   const { username } = authStore();
   const [isOwnProfile, setIsOwnProf] = useState<boolean>(false);
   const [userStats, setUserStats] = useState<FavsCountSchema | null>(null);
   const [loadingStats, setLoadingStats] = useState<boolean>(true);

   useEffect(() => {
      const fetchUserStats = () => {
         if (name?.toLowerCase() === username) {
            setIsOwnProf(true);
         }
         setLoadingStats(true);
         getFavsStats(
            TypeStatsEnum.a_m_favs,
            isOwnProfile ? username ?? "" : name?.toLowerCase() ?? ""
         )
            .then((resp) => {
               setUserStats(resp);
            })
            .catch((error) => {
               console.log(error);
            })
            .finally(() => setLoadingStats(false));
      };
      fetchUserStats();
   }, []);
   return loadingStats ? (
      <ProfileStatsSkeleton />
   ) : (
      <>
         <div className="flex flex-row gap-3">
            <h2 className="text-2xl font-bold">Estadísticas</h2>
            <Link
               to="/explore/mangas?emision=1" //TODO: contruir pagina de estadisticas
               className="flex flex-row btn-link text-sm font-semibold"
            >
               Ver estadísticas completas{" "}
               <SquareArrowOutUpRightIcon size={16} />
            </Link>
         </div>

         <ChartsStatusFavAM dataStats={userStats} />
      </>
   );
}
