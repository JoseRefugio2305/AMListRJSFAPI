import { Button } from "flowbite-react";
import { Sidebar } from "primereact/sidebar";
import { lazy, useEffect, useState } from "react";
import { ChartArea, ListCheck, Menu, TvMinimalPlay } from "lucide-react";
import StatsSection from "../../components/Dashboard/StatsSection";
import { authStore } from "../../store/authStore";
import { useNavigate } from "react-router";
import { DetailsSkeleton } from "../../components/Skeletons/DetailsSkeleton";

export default function DashboardStatsPage() {
   const navigate = useNavigate();
   const [visible, setVisible] = useState<boolean>(false);
   const [pageSelect, setPageSelect] = useState<number>(1);
   const [loading, setLoading] = useState<boolean>(true);
   const { rol } = authStore();

   useEffect(() => {
      const checkRol = () => {
         if (rol !== 1) {
            navigate("/login", { replace: true });
         } else {
            setLoading(false);
         }
      };
      checkRol();
   }, [rol, navigate]);

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         {loading ? (
            <DetailsSkeleton />
         ) : (
            <>
               <Sidebar visible={visible} onHide={() => setVisible(false)}>
                  <h2 className="text-2xl font-bold flex flex-row gap-4">
                     <ChartArea size={28} /> Dashboard
                  </h2>
                  <Button
                     className="hover:underline hover:bg-purple-600 dark:hover:bg-purple-600 hover:text-white font-semibold text-md bg-purple-500 dark:bg-purple-500 rounded-3xl px-2 py-1 w-full justify-center flex items-center text-white my-3"
                     onClick={() => setPageSelect(1)}
                  >
                     <ChartArea size={28} /> Dasboard
                  </Button>
                  <h2 className="text-2xl font-bold flex flex-row gap-4">
                     <TvMinimalPlay size={28} /> Animes
                  </h2>
                  <Button
                     className="hover:underline hover:bg-purple-600 dark:hover:bg-purple-600 hover:text-white font-semibold text-md bg-purple-500 dark:bg-purple-500 rounded-3xl px-2 py-1 w-full justify-center flex items-center text-white my-3"
                     onClick={() => setPageSelect(2)}
                  >
                     <ListCheck size={28} /> Lista de Animes
                  </Button>
               </Sidebar>
               <Button onClick={() => setVisible(!visible)} color="purple">
                  <Menu size={28} />
               </Button>
               <section className="w-full">
                  {pageSelect === 1 ? <StatsSection /> : <></>}
               </section>
            </>
         )}
      </main>
   );
}
