import { useNavigate } from "react-router";
import { optionsTypeStat } from "../types/statsTypes";
import { useEffect, useState } from "react";
import type { FavsCountSchema } from "../schemas/statsSchemas";
import { getFavsStats } from "../services/statsServices";
import type { OptionsSelectInterface } from "../types/filterTypes";



export function useStatsFavs(name: string, username: string) {
     const navigate = useNavigate();
     const [isOwnProfile, setIsOwnProf] = useState<boolean>(false);
     const [userStats, setUserStats] = useState<FavsCountSchema | null>(null);
     const [loadingStats, setLoadingStats] = useState<boolean>(true);
     const [selTypeStat, setSelTypeStat] = useState<OptionsSelectInterface>(optionsTypeStat[0]);

     useEffect(() => {
          const fetchUserStats = () => {
               if (name?.toLowerCase() === username) {
                    setIsOwnProf(true);
               }
               setLoadingStats(true);
               getFavsStats(
                    selTypeStat.code,
                    isOwnProfile ? username ?? "" : name?.toLowerCase() ?? ""
               )
                    .then((resp) => {
                         if (!resp) {
                              navigate("/404-not-found");
                         }

                         setUserStats(resp);
                    })
                    .catch((error) => {
                         console.log(error);
                    })
                    .finally(() => setLoadingStats(false));
          };
          fetchUserStats();
     }, [selTypeStat]);

     return {
          selTypeStat,
          setSelTypeStat,
          loadingStats,
          userStats
     }
}