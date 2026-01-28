import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { DetailsSkeleton } from "../../components/Skeletons/DetailsSkeleton";
import { LazyLoadImage } from "../../components/Common/LazyLoadImage";
import { cutText } from "../../utils/common";
import { AdpRelLink } from "../../components/Common/Details/AdpRelLink";
import { LinkPill } from "../../components/Common/Details/LinkPill";
import { Description } from "../../components/Common/Details/Description";
import { TitulosAlt } from "../../components/Common/Details/TitulosAlt";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import type { MangaCompleteSchema } from "../../schemas/mangaSchemas";
import { getMangaDetails } from "../../services/mangaServices";
import { MangaRelationsSection } from "../../components/Manga/Details/RelationsSection";
import { MoreInfoManga } from "../../components/Manga/Details/MoreInfo";

export default function MangaDetailsPage() {
   const navigate = useNavigate();
   const { key_manga } = useParams();
   const [mangaDetails, setMangaDetails] = useState<MangaCompleteSchema>();
   const [loading, setLoading] = useState<boolean>(true);
   const [fav_status, setFav] = useState<boolean>(false);
   const [statusView, setStatusView] = useState<number>(5);

   useEffect(() => {
      const fetchMangaDetails = () => {
         const k_a = parseInt(key_manga ?? "0", 10);
         setLoading(true);
         if (k_a && k_a > 0) {
            getMangaDetails(k_a)
               .then((resp) => {
                  if (!resp.is_success) {
                     navigate("/404-not-found");
                  }
                  if (resp.manga) {
                     setMangaDetails(resp.manga);
                     setFav(resp.manga?.isFav ?? false);
                     setStatusView(resp.manga?.statusView ?? 5);
                  }
               })
               .catch((error) => {
                  console.error(error);
                  navigate("/404-not-found");
               })
               .finally(() => setLoading(false));
         } else {
            navigate("/404-not-found");
         }
      };
      fetchMangaDetails();
   }, [key_manga, navigate]);

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 pb-14 mt-5 min-h-screen">
         {loading ? (
            <DetailsSkeleton />
         ) : (
            mangaDetails && (
               <div className="flex flex-col gap-3">
                  <Breadcrumbs
                     items={[
                        { label: "Home", to: "/" },
                        { label: "Manga", to: "/manga" },
                        { label: mangaDetails.titulo },
                     ]}
                  />
                  <h1 className="text-3xl font-bold underline  mx-auto px-5">
                     {mangaDetails.titulo}
                  </h1>
                  <div className="flex flex-col sm:flex-row w-full p-0">
                     <section className="w-full flex flex-col items-center mb-4 gap-3">
                        <LazyLoadImage
                           src={"/default_image.jpg"}
                           // src={mangaDetails.animeImages.img}
                           alt={cutText(mangaDetails.titulo, 50)}
                           className="w-[50%] rounded-2xl shadow-2xl"
                        />
                        <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700 w-[70%] flex flex-col gap-1">
                           <MoreInfoManga
                              id={mangaDetails.id}
                              tipo={mangaDetails.tipo}
                              publicando={mangaDetails.publicando}
                              fechaComienzoPub={mangaDetails.fechaComienzoPub}
                              fechaFinPub={mangaDetails.fechaFinPub}
                              calificacion={mangaDetails.calificacion}
                              numRatings={mangaDetails.numRatings}
                              linkMAL={mangaDetails.linkMAL}
                              link_p={mangaDetails.link_p}
                              capitulos={mangaDetails.capitulos}
                              volumenes={mangaDetails.volumenes}
                              fav_status={fav_status}
                              setFav={setFav}
                              statusView={statusView}
                              setStatusView={setStatusView}
                           />
                        </div>
                     </section>
                     <section className="w-[90%] mx-auto md:w-full flex flex-col mb-4 gap-3">
                        <TitulosAlt titulos_alt={mangaDetails.titulos_alt} />
                        <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700">
                           <Description
                              descripcion={mangaDetails.descripcion}
                           />
                        </div>
                        <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700">
                           <h2 className="text-lg font-bold">
                              Editorial(es) de Manga
                           </h2>
                           <div className="flex flex-row flex-wrap">
                              {mangaDetails.editoriales &&
                              mangaDetails.editoriales.length > 0 ? (
                                 mangaDetails.editoriales.map((edt) => (
                                    <LinkPill
                                       key={edt.id_MAL}
                                       link={`/explore/mangas?editorials=${edt.id_MAL}`}
                                       textLink={edt.nombre}
                                    />
                                 ))
                              ) : (
                                 <p className="text-sm font-bold">
                                    Sin editoriales
                                 </p>
                              )}
                           </div>
                        </div>

                        <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700">
                           <h2 className="text-lg font-bold">
                              Autor(es) de Manga
                           </h2>
                           <div className="flex flex-row flex-wrap">
                              {mangaDetails.autores &&
                              mangaDetails.autores.length > 0 ? (
                                 mangaDetails.autores.map((aut) => (
                                    <LinkPill
                                       key={aut.id_MAL}
                                       link={`/explore/mangas?authors=${aut.id_MAL}`}
                                       textLink={aut.nombre}
                                    />
                                 ))
                              ) : (
                                 <p className="text-sm font-bold">
                                    Sin autores
                                 </p>
                              )}
                           </div>
                        </div>
                        {mangaDetails.relaciones &&
                           mangaDetails.relaciones.length > 0 && (
                              <MangaRelationsSection
                                 relations={mangaDetails.relaciones}
                              />
                           )}

                        {mangaDetails.adaptaciones &&
                           mangaDetails.adaptaciones.length > 0 && (
                              <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700">
                                 <h2 className="text-lg font-bold">
                                    Animes Relacionados
                                 </h2>
                                 <div className="flex flex-row flex-wrap">
                                    {mangaDetails.adaptaciones.map((adpt) => (
                                       <AdpRelLink
                                          key={adpt.id_MAL}
                                          is_anime={true}
                                          title={adpt.titulo}
                                          key_am={adpt.key_anime}
                                          image={adpt.animeImages.img_sm}
                                          type_rel="Adaptación"
                                       />
                                    ))}
                                 </div>
                              </div>
                           )}

                        <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700">
                           <h2 className="text-lg font-bold">Géneros</h2>
                           <div className="flex flex-row flex-wrap">
                              {mangaDetails.generos &&
                              mangaDetails.generos.length > 0 ? (
                                 mangaDetails.generos.map((gen) => (
                                    <LinkPill
                                       key={gen.id_MAL}
                                       link={`/explore/mangas?genres=${gen.id_MAL}`}
                                       textLink={gen.nombre}
                                    />
                                 ))
                              ) : (
                                 <p className="text-sm font-bold">
                                    Sin géneros
                                 </p>
                              )}
                           </div>
                        </div>
                     </section>
                  </div>
               </div>
            )
         )}
      </main>
   );
}
