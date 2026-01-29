import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import {
   AnimeUpdateZ,
   type AnimeCompleteSchema,
} from "../../schemas/animeSchemas";
import { getAnimeDetails } from "../../services/animeServices";
import { EditSkeleton } from "../../components/Skeletons/EditSkeleton";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { getTitleForLink } from "../../utils/common";
import { Pencil } from "lucide-react";
import { Button, Card } from "flowbite-react";
import { parseFloatStringNumber, parseStringNumber } from "../../utils/parse";
import type { FilterObjSchema } from "../../schemas/filtersSchemas";
import {
   optionsEmision,
   type OptionsSelectInterface,
} from "../../types/filterTypes";
import { optionsTipoAnime } from "../../types/animeTypes";
import { MultiSelectsForm } from "../../components/Dashboard/Anime/FormEdit/MultiSelectsForm";
import { GeneralSectionForm } from "../../components/Dashboard/Anime/FormEdit/GeneralSectionForm";
import { ImagesSectionForm } from "../../components/Dashboard/Anime/FormEdit/ImagesSectionForm";
import type { AnimeImagesSharedSchema } from "../../schemas/relationsSchemas";
import { toastStore } from "../../store/toastStore";
import { updateAnime } from "../../services/dashboardAnimeServides";

export default function AnimeEditPage() {
   const navigate = useNavigate();
   const { key_anime } = useParams();
   const [animeData, setAnimeData] = useState<AnimeCompleteSchema>();
   const [selGenres, setSelGenres] = useState<FilterObjSchema[]>([]);
   const [selStudios, setSelStudios] = useState<FilterObjSchema[]>([]);
   const [emisionDate, setEmisionDate] = useState<Date | null>(null);
   const [selEmision, setSelEmision] = useState<OptionsSelectInterface | null>(
      null
   );
   const [selTipoAnime, setSelTipoAnime] =
      useState<OptionsSelectInterface | null>(null);
   const showToast = toastStore((s) => s.showToast);
   const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
      const fetchAnimeData = async () => {
         const k_a = parseStringNumber(key_anime ?? "0");
         setLoading(true);
         if (k_a && k_a > 0) {
            await getAnimeDetails(k_a)
               .then((resp) => {
                  if (!resp.is_success) {
                     navigate("/404-not-found");
                  }
                  if (resp.anime) {
                     setAnimeData(resp.anime);
                     setSelEmision(
                        optionsEmision.filter(
                           (ope) => ope.code === resp.anime?.emision
                        )[0]
                     );
                     setSelTipoAnime(
                        optionsTipoAnime.filter(
                           (opt) => opt.code === resp.anime?.tipo
                        )[0]
                     );
                     setEmisionDate(new Date(resp.anime.fechaEmision));
                  }
               })
               .catch((error) => {
                  console.error(error);
                  navigate("/404-not-found");
               });
            setLoading(false);
         } else {
            navigate("/404-not-found");
         }
      };
      fetchAnimeData();
   }, [key_anime]);

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      const formData = new FormData(event.currentTarget);
      const key = parseStringNumber(key_anime ?? "0");
      const titulo = String(formData.get("titulo") ?? "");
      const descripcion = String(formData.get("descripcion") ?? "");
      const episodios = parseStringNumber(
         String(formData.get("episodios") ?? "0")
      );
      const calificacion = parseFloatStringNumber(
         String(formData.get("calificacion") ?? "0")
      );
      const numRatings = parseStringNumber(
         String(formData.get("numRatings") ?? "0")
      );
      const link_p = String(formData.get("link_p") ?? "");
      const linkMAL = String(formData.get("linkMAL") ?? "");
      const fechaEmision = emisionDate?.toISOString().split("T")[0];
      const emision = selEmision?.code;
      const tipo = selTipoAnime?.code;
      const animeImages: AnimeImagesSharedSchema = {
         img: String(formData.get("img") ?? ""),
         img_sm: String(formData.get("imgsm") ?? ""),
         img_l: String(formData.get("imglg") ?? ""),
      };
      const generos = selGenres.map((g) => {
         return { id_MAL: g.code, nombre: g.name };
      });
      const studios = selStudios.map((std) => {
         return { id_MAL: std.code, nombre: std.name };
      });
      const parsed = AnimeUpdateZ.safeParse({
         key_anime: key,
         id_MAL: animeData?.id_MAL,
         titulo,
         descripcion,
         episodios,
         calificacion,
         numRatings,
         link_p,
         linkMAL,
         fechaEmision,
         emision,
         tipo,
         animeImages,
         generos,
         studios,
         fechaAdicion: animeData?.fechaAdicion,
         relaciones: animeData?.relaciones,
         adaptaciones: animeData?.adaptaciones,
         titulos_alt: animeData?.titulos_alt,
      });

      if (!parsed.success) {
         showToast({
            severity: "error",
            summary: "Error",
            detail: parsed.error.issues[0].message,
         });
         setLoading(false);
         setLoading(false);
      } else {
         updateAnime(parsed.data, animeData?.id || "")
            .then((resp) => {
               showToast({
                  severity: resp.is_success ? "success" : "error",
                  summary: resp.is_success ? "Exito!" : "Error",
                  detail: resp.message,
               });

               if (resp.is_success) {
                  setTimeout(() => {
                     window.location.reload();
                  }, 3000);
               } else {
                  setLoading(false);
               }
            })
            .catch((error) => {
               console.log(error);
               showToast({
                  severity: "error",
                  summary: "Error",
                  detail: "Ocurrio un error al procesar la petición.",
               });
               setLoading(false);
            });
      }
   };

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 pb-14 mt-5 min-h-screen">
         {loading ? (
            <EditSkeleton />
         ) : (
            animeData && (
               <>
                  <header>
                     <header>
                        <Breadcrumbs
                           items={[
                              { label: "Home", to: "/" },
                              { label: "Anime", to: "/anime" },
                              {
                                 label: "Editar Anime",
                                 to: `/anime/${getTitleForLink(
                                    animeData.titulo
                                 )}/${animeData.key_anime}`,
                              },
                           ]}
                        />

                        <h1 className="text-5xl font-bold flex flex-row gap-5 underline mb-5">
                           <Pencil size={45} /> Editar Información del Anime
                        </h1>
                     </header>
                  </header>
                  <section className="w-full">
                     <Card className="dark:bg-gray-700">
                        <form
                           className="flex flex-col gap-4"
                           onSubmit={handleSubmit}
                        >
                           <GeneralSectionForm
                              animeData={animeData}
                              emisionDate={emisionDate}
                              setEmisionDate={setEmisionDate}
                              selEmision={selEmision}
                              setSelEmision={setSelEmision}
                              selTipoAnime={selTipoAnime}
                              setSelTipoAnime={setSelTipoAnime}
                           />
                           <ImagesSectionForm
                              animeImages={animeData.animeImages}
                           />
                           <MultiSelectsForm
                              animeData={animeData}
                              selGenres={selGenres}
                              setSelGenres={setSelGenres}
                              selStudios={selStudios}
                              setSelStudios={setSelStudios}
                           />
                           <div className="flex flex-col md:flex-row gap-4 w-full px-7 justify-end">
                              <Button
                                 color="purple"
                                 className="md:w-[50%] w-full mb-3 shrink-0 font-bold text-md"
                                 type="submit"
                              >
                                 Confirmar
                              </Button>
                              <Button
                                 color="default"
                                 className="md:w-[50%] w-full mb-3 shrink-0 font-bold text-md"
                                 onClick={() =>
                                    navigate(
                                       `/anime/${getTitleForLink(
                                          animeData.titulo
                                       )}/${animeData.key_anime}`
                                    )
                                 }
                              >
                                 Cancelar
                              </Button>
                           </div>
                        </form>
                     </Card>
                  </section>
               </>
            )
         )}
      </main>
   );
}
