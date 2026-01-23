import { Button } from "flowbite-react";
import {
   Brush,
   ChartArea,
   ListCheck,
   Menu,
   TvMinimalPlayIcon,
} from "lucide-react";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { Link } from "react-router";

interface SidebarDashProps {
   selectedOption: number;
}

export function SidebarDash({ selectedOption }: SidebarDashProps) {
   const [visible, setVisible] = useState<boolean>(false);

   const getClassLink = (opt: number) => {
      return `hover:underline hover:bg-purple-600 dark:hover:bg-purple-600 hover:text-white font-semibold text-md bg-purple-500 dark:bg-purple-500 rounded-3xl px-2 py-1 w-full justify-center flex flex-row items-center text-white my-3 ${
         selectedOption === opt && "underline bg-purple-600 dark:bg-purple-600"
      }`;
   };

   return (
      <>
         <Sidebar visible={visible} onHide={() => setVisible(false)}>
            <h2 className="text-2xl font-bold flex flex-row gap-4">
               <ChartArea size={28} className="w-[20%]" />{" "}
               <p className="w-[80%]">Dashboard</p>
            </h2>
            <Link to="/dashboard" className={getClassLink(1)}>
               <ChartArea size={28} className="w-[20%] justify-center" />{" "}
               <p className="w-[80%] text-center">Dashboard</p>
            </Link>
            <Link to="/dashboard/genreslist" className={getClassLink(4)}>
               <ListCheck size={28} className="w-[20%] justify-center" />{" "}
               <p className="w-[80%] text-center">Géneros</p>
            </Link>
            <h2 className="text-2xl font-bold flex flex-row gap-4">
               <TvMinimalPlayIcon
                  size={28}
                  className="w-[20%] justify-center"
               />{" "}
               <p className="w-[80%] text-center">Animes</p>
            </h2>
            <Link to="/dashboard/animelist" className={getClassLink(2)}>
               <ListCheck size={28} className="w-[20%] justify-center" />{" "}
               <p className="w-[80%] text-center">Lista de Animes</p>
            </Link>
            <Link to="/dashboard/studioslist" className={getClassLink(5)}>
               <ListCheck size={28} className="w-[20%] justify-center" />{" "}
               <p className="w-[80%] text-center">Estudios de Animación</p>
            </Link>
            <h2 className="text-2xl font-bold flex flex-row gap-4">
               <Brush size={28} className="w-[20%] justify-center" />{" "}
               <p className="w-[80%] text-center">Mangas</p>
            </h2>
            <Link to="/dashboard/mangalist" className={getClassLink(3)}>
               <ListCheck size={28} className="w-[20%] justify-center" />{" "}
               <p className="w-[80%] text-center">Lista de Mangas</p>
            </Link>
            <Link to="/dashboard/editorialslist" className={getClassLink(6)}>
               <ListCheck size={28} className="w-[20%] justify-center" />{" "}
               <p className="w-[80%] text-center">Editoriales de Manga</p>
            </Link>
            <Link to="/dashboard/authorslist" className={getClassLink(7)}>
               <ListCheck size={28} className="w-[20%] justify-center" />{" "}
               <p className="w-[80%] text-center">Autores de Manga</p>
            </Link>
         </Sidebar>
         <Button onClick={() => setVisible(!visible)} color="purple">
            <Menu size={28} />
         </Button>
      </>
   );
}
