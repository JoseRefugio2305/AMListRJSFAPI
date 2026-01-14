import { lazy, Suspense, useState } from "react";
import { SidebarDash } from "../../components/Dashboard/SidebarDash";
import { MenuAnimeList } from "../../components/Dashboard/Anime/MenuAnimeList";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import {
   CircleCheckIcon,
   HourglassIcon,
   TvMinimalPlayIcon,
} from "lucide-react";
import { TabItem, Tabs } from "flowbite-react";
import { TopSkeleton } from "../../components/Skeletons/TopSkeleton";

const AnimeFullList = lazy(
   () => import("../../components/Dashboard/Anime/AnimeFullList.tsx")
);
const AnimeIncompleteList = lazy(
   () => import("../../components/Dashboard/Anime/AnimeIncompleteList.tsx")
);

export default function DashboardAnimeListPage() {
   const [listSel, setListSel] = useState<number>(0);

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
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
         <section className="w-full">
            <Tabs variant="underline" className="w-full justify-center">
               <TabItem
                  title={
                     <div className="text-lg md:text-2xl ml-2">
                        Animes Actualizados
                     </div>
                  }
                  icon={() => {
                     return <CircleCheckIcon size={24} />;
                  }}
                  onClick={() => setListSel(0)}
                  active={listSel === 0}
               >
                  <AnimeFullList />
               </TabItem>

               <TabItem
                  title={
                     <div className="text-lg md:text-2xl ml-2">
                        Animes Por Actualizar
                     </div>
                  }
                  icon={() => {
                     return <HourglassIcon size={24} />;
                  }}
                  onClick={() => setListSel(1)}
                  active={listSel === 1}
               >
                  <Suspense fallback={<TopSkeleton />}>
                     <AnimeIncompleteList />
                  </Suspense>
               </TabItem>
            </Tabs>
         </section>
      </main>
   );
}
