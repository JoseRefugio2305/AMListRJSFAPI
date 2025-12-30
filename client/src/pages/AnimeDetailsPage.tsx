import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getAnimeDetails } from "../services/animeServices";
import { DetailsSkeleton } from "../components/Skeletons/DetailsSkeleton";
import { LazyLoadImage } from "../components/Common/LazyLoadImage";
import { cutText } from "../utils/common";
import { AnimeRelationsSection } from "../components/Anime/Details/RelationsSection";
import { AdpRelLink } from "../components/Common/Details/AdpRelLink";
import { LinkPill } from "../components/Common/Details/LinkPill";
import { Description } from "../components/Common/Details/Description";
import { TitulosAlt } from "../components/Common/Details/TitulosAlt";
import { MoreInfoAnime } from "../components/Anime/Details/MoreInfo";
import { Breadcrumbs } from "../components/Layout/BreadCrumbs";
import type { AnimeCompleteSchema } from "../schemas/animeSchemas";

export default function AnimeDetailsPage() {
   const navigate = useNavigate();
   const { key_anime } = useParams();
   const [animeDetails, setAnimeDetails] = useState<AnimeCompleteSchema>();
   const [loading, setLoading] = useState<boolean>(true);
   const [fav_status, setFav] = useState<boolean>(false);
   const [statusView, setStatusView] = useState<number>(5);

   useEffect(() => {
      const k_a = parseInt(key_anime ?? "0", 10);

      if (k_a && k_a > 0) {
         getAnimeDetails(k_a)
            .then((resp) => {
               if (!resp.is_success) {
                  navigate("/404-not-found");
               }
               if (resp.anime) {
                  setAnimeDetails(resp.anime);
                  setFav(resp.anime?.isFav ?? false);
                  setStatusView(resp.anime?.statusView ?? 5);
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
   }, [key_anime, navigate]);

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 pb-14 mt-5 min-h-screen">
         {loading ? (
            <DetailsSkeleton />
         ) : (
            animeDetails && (
               <div className="flex flex-col gap-3">
                  <Breadcrumbs
                     items={[
                        { label: "Home", to: "/" },
                        { label: "Animes", to: "/anime" },
                        { label: animeDetails.titulo },
                     ]}
                  />
                  <h1 className="text-3xl font-bold underline  mx-auto px-5">
                     {animeDetails.titulo}
                  </h1>
                  <div className="flex flex-col sm:flex-row w-full p-0">
                     <section className="w-full flex flex-col items-center mb-4 gap-3">
                        <LazyLoadImage
                           src={"/default_image.jpg"}
                           // src={animeDetails.animeImages.img}
                           alt={cutText(animeDetails.titulo, 50)}
                           className="w-[50%] rounded-2xl shadow-2xl"
                        />
                        <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700 w-[70%] flex flex-col gap-1">
                           <MoreInfoAnime
                              id={animeDetails.id}
                              tipo={animeDetails.tipo}
                              emision={animeDetails.emision}
                              fechaEmision={animeDetails.fechaEmision}
                              calificacion={animeDetails.calificacion}
                              numRatings={animeDetails.numRatings}
                              linkMAL={animeDetails.linkMAL}
                              link_p={animeDetails.link_p}
                              episodios={animeDetails.episodios}
                              fav_status={fav_status}
                              setFav={setFav}
                              statusView={statusView}
                              setStatusView={setStatusView}
                           />
                        </div>
                     </section>
                     <section className="w-[90%] mx-auto md:w-full flex flex-col mb-4 gap-3">
                        <TitulosAlt titulos_alt={animeDetails.titulos_alt} />
                        <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700">
                           <Description
                              descripcion={animeDetails.descripcion}
                           />
                        </div>
                        <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700">
                           <h2 className="text-lg font-bold">
                              Estudio(s) de Animación
                           </h2>
                           <div className="flex flex-row flex-wrap">
                              {animeDetails.studios &&
                              animeDetails.studios.length > 0 ? (
                                 animeDetails.studios.map((std) => (
                                    <LinkPill
                                       key={std.id_MAL}
                                       link={`/explore/animes?studios=${std.id_MAL}`}
                                       textLink={std.nombre}
                                    />
                                 ))
                              ) : (
                                 <p className="text-sm font-bold">
                                    Sin estudios de animación
                                 </p>
                              )}
                           </div>
                        </div>
                        {animeDetails.relaciones &&
                           animeDetails.relaciones.length > 0 && (
                              <AnimeRelationsSection
                                 relations={animeDetails.relaciones}
                              />
                           )}

                        {animeDetails.adaptaciones &&
                           animeDetails.adaptaciones.length > 0 && (
                              <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700">
                                 <h2 className="text-lg font-bold">
                                    Mangas Relacionados
                                 </h2>
                                 <div className="flex flex-row flex-wrap">
                                    {animeDetails.adaptaciones.map((adpt) => (
                                       <AdpRelLink
                                          key={adpt.id_MAL}
                                          is_anime={false}
                                          title={adpt.titulo}
                                          key_am={adpt.key_manga}
                                          image={adpt.mangaImages.img_sm}
                                          type_rel="Adaptación"
                                       />
                                    ))}
                                 </div>
                              </div>
                           )}

                        <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700">
                           <h2 className="text-lg font-bold">Géneros</h2>
                           <div className="flex flex-row flex-wrap">
                              {animeDetails.generos &&
                              animeDetails.generos.length > 0 ? (
                                 animeDetails.generos.map((gen) => (
                                    <LinkPill
                                       key={gen.id_MAL}
                                       link={`/explore/animes?genres=${gen.id_MAL}`}
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
