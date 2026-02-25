import { optionsTypeStat, TypeStatsEnum } from "../types/statsTypes";
import { useEffect, useState } from "react";
import type { FullStatsSchema } from "../schemas/statsSchemas";
import { getFullStatsDash } from "../services/statsServices";
import type { OptionsSelectInterface } from "../types/filterTypes";



export function useStatsDashboard() {
     const [stats, setStats] = useState<FullStatsSchema | null>(null);
     const [conteosGen, setConteosGen] = useState<FullStatsSchema | null>(null);
     const [loadingStats, setLoadingStats] = useState<boolean>(true);
     const [loadingConteos, setLoadingConteos] = useState<boolean>(true);
     const [selTypeStat, setSelTypeStat] = useState<OptionsSelectInterface>(optionsTypeStat[1]);

     useEffect(() => {
          const fetchStats = () => {
               setLoadingStats(true);
               getFullStatsDash(selTypeStat.code as TypeStatsEnum)
                    .then((resp) => {
                         setStats(resp)
                         setLoadingStats(false)
                    }).catch((error) => {
                         console.error(error)
                         setLoadingStats(false)
                    })
          };
          fetchStats();
     }, [selTypeStat]);

     useEffect(() => {
          const fetchStats = () => {
               setLoadingConteos(true);
               getFullStatsDash(TypeStatsEnum.a_m_favs)
                    .then((resp) => {
                         setConteosGen(resp)
                         setLoadingConteos(false)
                    }).catch((error) => {
                         console.error(error)
                         setLoadingConteos(false)
                    })
          };
          fetchStats();
     }, [])

     return {
          selTypeStat,
          setSelTypeStat,
          loadingStats,
          stats, loadingConteos, conteosGen
     }
}