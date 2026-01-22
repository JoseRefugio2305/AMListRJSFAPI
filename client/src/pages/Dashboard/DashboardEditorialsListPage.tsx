import EditorialesList from "../../components/Dashboard/Editoriales/EditorialesList";
import { SidebarDash } from "../../components/Dashboard/SidebarDash";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { BookImageIcon } from "lucide-react";

export default function DashboardEditorialsListPage() {
   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         <SidebarDash selectedOption={6} />
         <header>
            <header>
               <Breadcrumbs
                  items={[
                     { label: "Home", to: "/" },
                     { label: "Dahsboard", to: "/dashboard" },
                     { label: "Lista de Editoriales de Manga" },
                  ]}
               />

               <h1 className="text-5xl font-bold flex flex-row gap-5 underline mb-5">
                  <BookImageIcon size={45} /> Editoriales de Manga
               </h1>
            </header>
         </header>
         <section className="w-full">
            <EditorialesList />
         </section>
      </main>
   );
}
