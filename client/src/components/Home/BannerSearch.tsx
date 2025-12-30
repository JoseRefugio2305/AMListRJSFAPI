import { Link, useNavigate } from "react-router";
import { Button, TextInput } from "flowbite-react";
import { useId, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { Dropdown } from "primereact/dropdown";
import { authStore } from "../../store/authStore";
import {
   optionsTipoCont,
   type OptionsSelectInterface,
} from "../../types/filterTypes";
export function BannerSearch() {
   const username = authStore((s) => s.username);
   const navigate = useNavigate();
   const idTitSearchInput = useId();
   const [titSearch, setTitSearch] = useState<string>("");
   const [selTipoCont, setTipoCont] = useState<OptionsSelectInterface | null>(
      null
   );
   const idSelTipoCont = useId();

   const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      if (titSearch.trim() === "") return;

      const tipoCont = selTipoCont?.code ?? 3;

      const url = `/explore/${
         tipoCont === 1 ? "animes" : tipoCont === 2 ? "mangas" : ""
      }?tit_search=${titSearch.trim()}`;
      navigate(url);
   };
   return (
      <section className="w-auto grid gap-5 shadow-2xl md:rounded-2xl rounded-none dark:bg-gray-700 p-6">
         <h1 className="text-2xl font-bold md:text-4xl text-center">
            Descubre Tu Nueva Historia Favorita
         </h1>
         {username ? (
            <>
               <p className="text-center">
                  Explora una gran librería de Animes y Mangas.
               </p>
               <form role="search" id="formSearch" onSubmit={handleSubmit}>
                  <div className="md:flex w-full gap-4 min-w-0 overflow-x-auto">
                     <TextInput
                        id={idTitSearchInput}
                        name="title_search"
                        type="text"
                        value={titSearch}
                        onChange={(e) => setTitSearch(e.target.value)}
                        icon={Search}
                        className="md:w-[70%] w-full mb-3 min-w-0 h-full"
                        placeholder="Ingresa el titulo a buscar"
                        required
                     />
                     <Dropdown
                        value={selTipoCont}
                        onChange={(e) => setTipoCont(e.value)}
                        options={optionsTipoCont}
                        optionLabel="name"
                        showClear
                        placeholder="Tipo de Contenido"
                        className="md:w-[20%] mb-3 w-full shrink-0"
                        id={idSelTipoCont}
                     />
                     <Button
                        color="purple"
                        className="md:w-[10%] w-full mb-3 shrink-0"
                        type="submit"
                     >
                        Buscar
                     </Button>
                  </div>
               </form>
            </>
         ) : (
            <>
               <p className="text-center">
                  Explora una gran librería de Animes y Mangas. Inicia Sesión o
                  Regístrate y crea tus propias listas de favoritos.
               </p>
               <div className="flex items-center w-auto justify-center gap-5 p-3">
                  <Link to="/login" className="btn-link">
                     Inicia Sesión o Regístrate
                  </Link>
                  <Link
                     to="/explore"
                     className="rounded-md  p-1 md:p-2 text-center dark:text-white bg-transparent  border-2 border-purple-700 hover:bg-purple-600 hover:text-white"
                  >
                     Explorar
                  </Link>
               </div>
            </>
         )}
      </section>
   );
}
