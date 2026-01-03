import { lazy, Suspense, useState } from "react";
import { useParams } from "react-router";
import { authStore } from "../../store/authStore";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { ChartArea } from "lucide-react";
import { ChartsStatusFavAM } from "../../components/Charts/ChartsStatusFavAM";
import { ChartSkeleton } from "../../components/Skeletons/ChartSkeleton";
import { useStatsFavs } from "../../hooks/useStatsFavs";
import { TabMenuStats } from "../../components/Common/Stats/TabMenuStats";
import { TypeStatsEnum } from "../../types/statsTypes";

const ChartGeneros = lazy(() => import("../../components/Charts/ChartGeneros"));
const ChartsTypeAM = lazy(() => import("../../components/Charts/ChartsTypeAM"));
const ChartStudios = lazy(() => import("../../components/Charts/ChartStudios"));
const ChartEditoriales = lazy(
   () => import("../../components/Charts/ChartEditoriales")
);

export default function UserStatsPage() {
   const { username } = authStore();
   const { name } = useParams();

   const [statActive, setStatActive] = useState<number>(TypeStatsEnum.a_m_favs);

   const { selTypeStat, setSelTypeStat, loadingStats, userStats } =
      useStatsFavs(name ?? "", username ?? "");

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 pb-14 mt-5 min-h-screen">
         <header>
            <Breadcrumbs
               items={[
                  { label: "Home", to: "/" },
                  { label: "Usuario" },
                  { label: name ?? "", to: `/user/${name}/lists` },
                  { label: "Estadísticas" },
               ]}
            />
            <h1 className="text-5xl font-bold flex flex-row gap-5 underline">
               <ChartArea size={45} /> Animes
            </h1>
         </header>
         <section className="w-full">
            <TabMenuStats
               loadingStats={loadingStats}
               statActive={statActive}
               setStatActive={setStatActive}
               setSelTypeStat={setSelTypeStat}
               selTypeStat={selTypeStat}
            />
         </section>
         {loadingStats ? (
            <ChartSkeleton />
         ) : (
            <>
               <section className="w-full">
                  {statActive === TypeStatsEnum.a_m_favs ? (
                     <ChartsStatusFavAM dataStats={userStats} />
                  ) : (
                     <Suspense fallback={<ChartSkeleton />}>
                        {statActive === TypeStatsEnum.generos ? (
                           <ChartGeneros dataStats={userStats} />
                        ) : statActive === TypeStatsEnum.tipo_a_m ? (
                           <ChartsTypeAM dataStats={userStats} />
                        ) : statActive === TypeStatsEnum.studios ? (
                           <ChartStudios dataStats={userStats} />
                        ) : (
                           <ChartEditoriales dataStats={userStats} />
                        )}
                     </Suspense>
                  )}
               </section>
            </>
         )}
      </main>
   );
}
