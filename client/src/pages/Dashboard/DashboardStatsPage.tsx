import { useEffect, useState } from "react";
import StatsSection from "../../components/Dashboard/StatsSection";
import { authStore } from "../../store/authStore";
import { useNavigate } from "react-router";
import { DetailsSkeleton } from "../../components/Skeletons/DetailsSkeleton";
import { SidebarDash } from "../../components/Dashboard/SidebarDash";

export default function DashboardStatsPage() {
   const navigate = useNavigate();
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
               <SidebarDash selectedOption={1} />
               <section className="w-full">
                  <StatsSection />
               </section>
            </>
         )}
      </main>
   );
}
