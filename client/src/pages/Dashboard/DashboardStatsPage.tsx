import StatsSection from "../../components/Dashboard/StatsSection";
import { SidebarDash } from "../../components/Dashboard/SidebarDash";

export default function DashboardStatsPage() {
   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         <SidebarDash selectedOption={1} />
         <section className="w-full">
            <StatsSection />
         </section>
      </main>
   );
}
