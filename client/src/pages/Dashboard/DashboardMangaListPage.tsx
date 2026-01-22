import { lazy, Suspense, useState } from "react";
import { SidebarDash } from "../../components/Dashboard/SidebarDash";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { Brush, CircleCheckIcon, HourglassIcon } from "lucide-react";
import { MenuMangaList } from "../../components/Dashboard/Manga/MenuMangaList.tsx";
import { TabItem, Tabs } from "flowbite-react";
import { TopSkeleton } from "../../components/Skeletons/TopSkeleton.tsx";

const MangaFullList = lazy(
   () => import("../../components/Dashboard/Manga/MangaFullList.tsx")
);
const MangaIncompleteList = lazy(
   () => import("../../components/Dashboard/Manga/MangaIncompleteList.tsx")
);

export default function DashboardMangaListPage() {
   const [listSel, setListSel] = useState<number>(0);

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         <SidebarDash selectedOption={3} />
         <header>
            <header>
               <Breadcrumbs
                  items={[
                     { label: "Home", to: "/" },
                     { label: "Dahsboard", to: "/dashboard" },
                     { label: "Lista de Mangas" },
                  ]}
               />

               <h1 className="text-5xl font-bold flex flex-row gap-5 underline mb-5">
                  <Brush size={45} /> Mangas
               </h1>
            </header>
         </header>
         <section className="w-full">
            <MenuMangaList />
         </section>
         <section className="w-full">
            <Tabs variant="underline" className="w-full justify-center">
               <TabItem
                  title={
                     <div className="text-lg md:text-2xl ml-2">
                        Mangas Actualizados
                     </div>
                  }
                  icon={() => {
                     return <CircleCheckIcon size={24} />;
                  }}
                  onClick={() => setListSel(0)}
                  active={listSel === 0}
               >
                  <MangaFullList />
               </TabItem>

               <TabItem
                  title={
                     <div className="text-lg md:text-2xl ml-2">
                        Mangas Por Actualizar
                     </div>
                  }
                  icon={() => {
                     return <HourglassIcon size={24} />;
                  }}
                  onClick={() => setListSel(1)}
                  active={listSel === 1}
               >
                  <Suspense fallback={<TopSkeleton />}>
                     <MangaIncompleteList />
                  </Suspense>
               </TabItem>
            </Tabs>
         </section>
      </main>
   );
}
