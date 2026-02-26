import AutoresList from "../../components/Dashboard/Autores/AutoresList";
import { SidebarDash } from "../../components/Dashboard/SidebarDash";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { UserPenIcon } from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function DashboardAutoresListPage() {
   useDocumentTitle("Listado de Autores de Manga")
   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         <SidebarDash selectedOption={7} />
         <header>
            <header>
               <Breadcrumbs
                  items={[
                     { label: "Home", to: "/" },
                     { label: "Dahsboard", to: "/dashboard" },
                     { label: "Lista de Autores de Manga" },
                  ]}
               />

               <h1 className="text-5xl font-bold flex flex-row gap-5 underline mb-5">
                  <UserPenIcon size={45} /> Autores de Manga
               </h1>
            </header>
         </header>
         <section className="w-full">
            <AutoresList />
         </section>
      </main>
   );
}
