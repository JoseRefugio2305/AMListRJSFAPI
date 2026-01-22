import { lazy, Suspense, useState } from "react";
import { SidebarDash } from "../../components/Dashboard/SidebarDash";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { TvMinimalPlayIcon } from "lucide-react";
import GenerosList from "../../components/Dashboard/Generos/GenerosList.tsx";

export default function DashboardGenresListPage() {
   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         <SidebarDash selectedOption={4} />
         <header>
            <header>
               <Breadcrumbs
                  items={[
                     { label: "Home", to: "/" },
                     { label: "Dahsboard", to: "/dashboard" },
                     { label: "Lista de Géneros" },
                  ]}
               />

               <h1 className="text-5xl font-bold flex flex-row gap-5 underline mb-5">
                  <TvMinimalPlayIcon size={45} /> Géneros
               </h1>
            </header>
         </header>
         <section className="w-full">
            <GenerosList />
         </section>
      </main>
   );
}
