import { lazy, Suspense, useState } from "react";
import { TabMenuStats } from "../Common/Stats/TabMenuStats";
import { Breadcrumbs } from "../Layout/BreadCrumbs";
import { ChartArea } from "lucide-react";
import { TypeStatsEnum } from "../../types/statsTypes";
import { useStatsDashboard } from "../../hooks/useStatsDashboard";
import { ChartSkeleton } from "../Skeletons/ChartSkeleton";
import ChartsTypeAM from "../Charts/ChartsTypeAM";
import { ConteoSkeleton } from "../Skeletons/ConteoSkeleton";
import { ConteoSection } from "./ConteoSection";

const ChartGeneros = lazy(() => import("../../components/Charts/ChartGeneros"));
const ChartStudios = lazy(() => import("../../components/Charts/ChartStudios"));
const ChartEditoriales = lazy(
   () => import("../../components/Charts/ChartEditoriales")
);

export default function StatsSection() {
   const [statActive, setStatActive] = useState<number>(TypeStatsEnum.tipo_a_m);
   const {
      selTypeStat,
      setSelTypeStat,
      loadingStats,
      stats,
      conteosGen,
      loadingConteos,
   } = useStatsDashboard();

   return (
      <>
         <header>
            <Breadcrumbs
               items={[{ label: "Home", to: "/" }, { label: "Dahsboard" }]}
            />

            <h1 className="text-5xl font-bold flex flex-row gap-5 underline mb-5">
               <ChartArea size={45} /> Dashboard
            </h1>
         </header>
         <section className="w-full">
            {loadingConteos ? (
               <ConteoSkeleton />
            ) : (
               <ConteoSection conteos={conteosGen} />
            )}
         </section>
         <section className="w-full">
            <TabMenuStats
               loadingStats={loadingStats}
               statActive={statActive}
               setStatActive={setStatActive}
               setSelTypeStat={setSelTypeStat}
               selTypeStat={selTypeStat}
               isDashboard={true}
            />
         </section>
         {loadingStats ? (
            <ChartSkeleton />
         ) : (
            <>
               <section className="w-full">
                  {statActive === TypeStatsEnum.tipo_a_m ? (
                     <ChartsTypeAM dataStats={stats} />
                  ) : (
                     <Suspense fallback={<ChartSkeleton />}>
                        {statActive === TypeStatsEnum.generos ? (
                           <ChartGeneros dataStats={stats} />
                        ) : statActive === TypeStatsEnum.studios ? (
                           <ChartStudios dataStats={stats} />
                        ) : (
                           <ChartEditoriales dataStats={stats} />
                        )}
                     </Suspense>
                  )}
               </section>
            </>
         )}
      </>
   );
}
