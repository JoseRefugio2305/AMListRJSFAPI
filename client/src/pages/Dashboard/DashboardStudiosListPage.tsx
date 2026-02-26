import EstudiosList from "../../components/Dashboard/Estudios/EstudiosList";
import { SidebarDash } from "../../components/Dashboard/SidebarDash";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { LaptopMinimal } from "lucide-react";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function DashboardStudiosListPage() {
   useDocumentTitle("Listado de Estudios de Animación")
   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 px-5 pb-14 mt-5 gap-8 min-h-screen">
         <SidebarDash selectedOption={5} />
         <header>
            <header>
               <Breadcrumbs
                  items={[
                     { label: "Home", to: "/" },
                     { label: "Dahsboard", to: "/dashboard" },
                     { label: "Lista de Estudios de Animación" },
                  ]}
               />

               <h1 className="text-5xl font-bold flex flex-row gap-5 underline mb-5">
                  <LaptopMinimal size={45} /> Estudios de Animación
               </h1>
            </header>
         </header>
         <section className="w-full">
            <EstudiosList />
         </section>
      </main>
   );
}
