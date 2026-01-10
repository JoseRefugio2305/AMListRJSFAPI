import { useNavigate } from "react-router";
import { DetailsSkeleton } from "../../components/Skeletons/DetailsSkeleton";
import { useEffect, useState } from "react";
import { authStore } from "../../store/authStore";
import { SidebarDash } from "../../components/Dashboard/SidebarDash";
import { MenuAnimeList } from "../../components/Dashboard/Anime/MenuAnimeList";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { TvMinimalPlayIcon } from "lucide-react";

export default function DashboardAnimeListPage() {
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
               <SidebarDash selectedOption={2} />
               <header>
                  <header>
                     <Breadcrumbs
                        items={[
                           { label: "Home", to: "/" },
                           { label: "Dahsboard", to: "/dashboard" },
                           { label: "Lista de Animes" },
                        ]}
                     />

                     <h1 className="text-5xl font-bold flex flex-row gap-5 underline mb-5">
                        <TvMinimalPlayIcon size={45} /> Animes
                     </h1>
                  </header>
               </header>{" "}
               <section className="w-full">
                  <MenuAnimeList />
               </section>
            </>
         )}
      </main>
   );
}
