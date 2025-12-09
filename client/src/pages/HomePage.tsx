import { Button } from "flowbite-react";
import { Link } from "react-router";
import { authStore } from "../store/authStore";
import { TopAnimes } from "../components/Anime/TopAnimes";
import { TopMangas } from "../components/Manga/TopMangas";
import { CarouselAnime } from "../components/Anime/CarouselAnime";
import { CarouselManga } from "../components/Manga/CarouselManga";

export default function HomaPage() {
   const username = authStore((s) => s.username);

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 pb-14 mt-5 gap-8">
         {/* TODO: Crear un apartado de busqueda rapida por tipo de contenido y titulo */}
         <section className="w-auto grid gap-5 shadow-2xl md:rounded-2xl rounded-none dark:bg-gray-700 p-6">
            <h1 className="text-2xl font-bold md:text-4xl text-center">
               Descubre Tu Nueva Historia Favorita
            </h1>
            <p className="text-center">
               Explora una gran librería de Animes y Mangas. Inicia Sesión o
               Regístrate y crea tus propias listas de favoritos.
            </p>
            <div className="flex items-center w-auto justify-center gap-5 p-3">
               <Link to="/login" className="btn-link">
                  Inicia Sesión o Regístrate
               </Link>
               <Button color="purple" outline className="dark:text-white">
                  Explorar
               </Button>
            </div>
         </section>
         <section>
            <CarouselAnime />
         </section>
         <section>
            <CarouselManga />
         </section>
         <section className="flex flex-row w-full flex-wrap">
            <TopAnimes />
            <TopMangas />
         </section>
         {!username && (
            <section className="w-auto grid gap-5 shadow-2xl md:rounded-2xl rounded-none dark:bg-gray-700 p-6">
               <h1 className="text-2xl font-bold md:text-4xl text-center">
                  Únete a la Comunidad
               </h1>
               <p className="text-center">
                  Crea una cuenta para personalizar tu experiencia, guardar tu
                  progreso y conectar con otros fans del anime y manga.
               </p>
               <div className="flex items-center w-auto justify-center gap-5 p-3">
                  <Link to="/login" className="btn-link">
                     Inicia Sesión o Regístrate
                  </Link>
               </div>
            </section>
         )}
      </main>
   );
}
