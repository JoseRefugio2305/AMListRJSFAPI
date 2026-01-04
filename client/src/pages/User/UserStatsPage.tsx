import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { authStore } from "../../store/authStore";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { ChartArea } from "lucide-react";
import { ChartsStatusFavAM } from "../../components/Charts/ChartsStatusFavAM";
import { ChartSkeleton } from "../../components/Skeletons/ChartSkeleton";
import { useStatsFavs } from "../../hooks/useStatsFavs";
import { TabMenuStats } from "../../components/Common/Stats/TabMenuStats";
import { TypeStatsEnum } from "../../types/statsTypes";
import { getUserDataProfile } from "../../services/userServices";
import { DetailsSkeleton } from "../../components/Skeletons/DetailsSkeleton";

const ChartGeneros = lazy(() => import("../../components/Charts/ChartGeneros"));
const ChartsTypeAM = lazy(() => import("../../components/Charts/ChartsTypeAM"));
const ChartStudios = lazy(() => import("../../components/Charts/ChartStudios"));
const ChartEditoriales = lazy(
   () => import("../../components/Charts/ChartEditoriales")
);

export default function UserStatsPage() {
   const navigate = useNavigate();
   const { username } = authStore();
   const { name } = useParams();
   const [, setIsOwnProf] = useState<boolean>(false);
   const [checkUser, setCheckUser] = useState<boolean>(true);

   const [statActive, setStatActive] = useState<number>(TypeStatsEnum.a_m_favs);

   useEffect(() => {
      const fetchUserData = async () => {
         const own = name?.trim().toLowerCase() === username;
         setIsOwnProf(own);
         setCheckUser(true);
         await getUserDataProfile(
            own ? username ?? "" : name?.toLowerCase() ?? ""
         )
            .then((resp) => {
               if (!resp) {
                  navigate("/404-not-found", { replace: true });
                  return;
               }
               setCheckUser(false);
            })
            .catch((error) => {
               console.error(error);
               navigate("/404-not-found", { replace: true });
            });
      };
      fetchUserData();
   }, [name]);

   const { selTypeStat, setSelTypeStat, loadingStats, userStats } =
      useStatsFavs(name ?? "", username ?? "");

   if (!name?.trim()) {
      return <Navigate to="/404-not-found" replace />;
   }

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 pb-14 mt-5 min-h-screen">
         {checkUser ? (
            <DetailsSkeleton />
         ) : (
            <>
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
            </>
         )}
      </main>
   );
}
