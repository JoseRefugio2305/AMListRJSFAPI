import { lazy, useState } from "react";
import { SidebarDash } from "../../components/Dashboard/SidebarDash";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { Brush } from "lucide-react";
import { MenuMangaList } from "../../components/Dashboard/Manga/MenuMangaList.tsx";

// const AnimeFullList = lazy(
//    () => import("../../components/Dashboard/Anime/AnimeFullList.tsx")
// );
// const AnimeIncompleteList = lazy(
//    () => import("../../components/Dashboard/Anime/AnimeIncompleteList.tsx")
// );

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
         </header>{" "}
         <section className="w-full"><MenuMangaList/></section>
         <section className="w-full"></section>
      </main>
   );
}
