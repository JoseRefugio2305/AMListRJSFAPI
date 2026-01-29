import { useNavigate, useParams } from "react-router";
import {
   MangaUpdateZ,
   type MangaCompleteSchema,
} from "../../schemas/mangaSchemas";
import type { FilterObjSchema } from "../../schemas/filtersSchemas";
import {
   optionsEmision,
   type OptionsSelectInterface,
} from "../../types/filterTypes";
import { parseFloatStringNumber, parseStringNumber } from "../../utils/parse";
import { getMangaDetails } from "../../services/mangaServices";
import { optionsTipoManga } from "../../types/mangaTypes";
import { useEffect, useState, type FormEvent } from "react";
import { EditSkeleton } from "../../components/Skeletons/EditSkeleton";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { getTitleForLink } from "../../utils/common";
import { Pencil } from "lucide-react";
import { Button, Card } from "flowbite-react";
import { toastStore } from "../../store/toastStore";
import { GeneralSectionForm } from "../../components/Dashboard/Manga/FormEdit/GeneralSectionForm";
import { ImagesSectionForm } from "../../components/Dashboard/Manga/FormEdit/ImagesSectionForm";
import { MultiSelectsForm } from "../../components/Dashboard/Manga/FormEdit/MultiSelectsForm";
import type { MangaImagesSharedSchema } from "../../schemas/relationsSchemas";
import { updateManga } from "../../services/dashboardMangaServices";

export default function MangaEditPage() {
   const navigate = useNavigate();
   const { key_manga } = useParams();
   const [mangaData, setMangaData] = useState<MangaCompleteSchema>();
   const [selGenres, setSelGenres] = useState<FilterObjSchema[]>([]);
   const [selEditorials, setSelEditorials] = useState<FilterObjSchema[]>([]);
   const [selAuthors, setSelAuthors] = useState<FilterObjSchema[]>([]);
   const [pubDate, setPubDate] = useState<Date | null>(null);
   const [endPubDate, setEndPubDate] = useState<Date | null>(null);
   const [selPubl, setSelPubl] = useState<OptionsSelectInterface | null>(null);
   const [selTipoManga, setSelTipoManga] =
      useState<OptionsSelectInterface | null>(null);
   const showToast = toastStore((s) => s.showToast);
   const [loading, setLoading] = useState<boolean>(true);
   useEffect(() => {
      const fetchmangaData = async () => {
         const k_m = parseStringNumber(key_manga ?? "0");
         setLoading(true);
         if (k_m && k_m > 0) {
            await getMangaDetails(k_m)
               .then((resp) => {
                  if (!resp.is_success) {
                     navigate("/404-not-found");
                  }
                  if (resp.manga) {
                     setMangaData(resp.manga);
                     setSelPubl(
                        optionsEmision.filter(
                           (ope) => ope.code === resp.manga?.publicando
                        )[0]
                     );
                     setSelTipoManga(
                        optionsTipoManga.filter(
                           (opt) => opt.code === resp.manga?.tipo
                        )[0]
                     );
                     setPubDate(new Date(resp.manga.fechaComienzoPub));
                     if(resp.manga.fechaFinPub&&resp.manga.fechaFinPub!=="None")
                     {setEndPubDate( new Date(resp.manga.fechaFinPub)
                     );}
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
      fetchmangaData();
   }, [key_manga]);

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      const formData = new FormData(event.currentTarget);
      const key = parseStringNumber(key_manga ?? "0");
      const titulo = String(formData.get("titulo") ?? "");
      const descripcion = String(formData.get("descripcion") ?? "");
      const capitulos = parseStringNumber(
         String(formData.get("capitulos") ?? "0")
      );
      const volumenes = parseStringNumber(
         String(formData.get("volumenes") ?? "0")
      );
      const calificacion = parseFloatStringNumber(
         String(formData.get("calificacion") ?? "0")
      );
      const numRatings = parseStringNumber(
         String(formData.get("numRatings") ?? "0")
      );
      const link_p = String(formData.get("link_p") ?? "");
      const linkMAL = String(formData.get("linkMAL") ?? "");
      const fechaComienzoPub = pubDate?.toISOString().split("T")[0];
      const fechaFinPub = endPubDate?.toISOString().split("T")[0];
      const publicando = selPubl?.code;
      const tipo = selTipoManga?.code;
      const mangaImages: MangaImagesSharedSchema = {
         img: String(formData.get("img") ?? ""),
         img_sm: String(formData.get("imgsm") ?? ""),
         img_l: String(formData.get("imglg") ?? ""),
      };
      const generos = selGenres.map((g) => {
         return { id_MAL: g.code, nombre: g.name };
      });
      const editoriales = selEditorials.map((edt) => {
         return { id_MAL: edt.code, nombre: edt.name };
      });
      const autores = selAuthors.map((aut) => {
         return { id_MAL: aut.code, nombre: aut.name };
      });
      const parsed = MangaUpdateZ.safeParse({
         key_manga: key,
         id_MAL: mangaData?.id_MAL,
         titulo,
         descripcion,
         capitulos,
         volumenes,
         calificacion,
         numRatings,
         link_p,
         linkMAL,
         fechaComienzoPub,
         fechaFinPub,
         publicando,
         tipo,
         mangaImages,
         generos,
         editoriales,
         autores,
         relaciones: mangaData?.relaciones,
         adaptaciones: mangaData?.adaptaciones,
         titulos_alt: mangaData?.titulos_alt,
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
         updateManga(parsed.data, mangaData?.id || "")
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
            mangaData && (
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
                                    mangaData.titulo
                                 )}/${mangaData.key_manga}`,
                              },
                           ]}
                        />

                        <h1 className="text-5xl font-bold flex flex-row gap-5 underline mb-5">
                           <Pencil size={45} /> Editar Información del Manga
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
                              mangaData={mangaData}
                              pubDate={pubDate}
                              setPubDate={setPubDate}
                              endPubDate={endPubDate}
                              setEndPubDate={setEndPubDate}
                              selPubl={selPubl}
                              setSelPubl={setSelPubl}
                              selTipoManga={selTipoManga}
                              setSelTipoManga={setSelTipoManga}
                           />
                           <ImagesSectionForm
                              mangaImages={mangaData.mangaImages}
                           />

                           <MultiSelectsForm
                              mangaData={mangaData}
                              selGenres={selGenres}
                              setSelGenres={setSelGenres}
                              selEditorials={selEditorials}
                              setSelEditorials={setSelEditorials}
                              selAuthors={selAuthors}
                              setSelAuthors={setSelAuthors}
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
                                       `/manga/${getTitleForLink(
                                          mangaData.titulo
                                       )}/${mangaData.key_manga}`
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
