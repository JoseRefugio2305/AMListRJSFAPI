import { TvMinimalPlay } from "lucide-react";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { authStore } from "../../store/authStore";
import { Navigate, useNavigate, useParams } from "react-router";
import { useFilters } from "../../hooks/useFilters";
import { TipoContenidoEnum } from "../../types/filterTypes";
import { SearchForm } from "../../components/Search/SearchForm";
import { useEffect, useState } from "react";
import { getUserDataProfile } from "../../services/userServices";
import { TabMenuStatusView } from "../../components/Common/User/TabMenuStatusView";
import { PaginationSkeleton } from "../../components/Skeletons/PaginationSekeleton";
import { AnimePagination } from "../../components/Anime/AnimePagination";
import { SearchSkeleton } from "../../components/Skeletons/SearchSkeleton";

export default function UserAnimeListPage() {
   const navigate = useNavigate();
   const { username } = authStore();
   const { name } = useParams();

   const [, setIsOwnProf] = useState<boolean>(false);
   const [checkUser, setCheckUser] = useState<boolean>(true);

   useEffect(() => {
      const fetchUserData = async () => {
         const own = name?.trim().toLowerCase() === username;
         setIsOwnProf(own);
         setCheckUser(true);
         await getUserDataProfile(
            own ? username ?? "" : name?.toLowerCase() ?? ""
         )
            .then((resp) => {
               if (!resp) {
                  navigate("/404-not-found", { replace: true });
                  return;
               }
               setCheckUser(false);
            })
            .catch((error) => {
               console.error(error);
               navigate("/404-not-found", { replace: true });
            });
      };
      fetchUserData();
   }, [name]);

   const {
      animes,
      totalAnimes,
      filtersParam,
      setFiltersParam,
      page,
      setPage,
      loading,
      setLoaging,
   } = useFilters(
      TipoContenidoEnum.anime,
      true,
      name ? (username === name ? username : name?.toLowerCase()) : ""
   );

   if (!name?.trim()) {
      return <Navigate to="/404-not-found" replace />;
   }

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 pb-14 mt-5 min-h-screen">
         {checkUser ? (
            <SearchSkeleton />
         ) : (
            <>
               <header>
                  <Breadcrumbs
                     items={[
                        { label: "Home", to: "/" },
                        { label: "Usuario" },
                        { label: name ?? "", to: `/user/${name}/lists` },
                        { label: "Lista de Animes" },
                     ]}
                  />
                  <h1 className="text-5xl font-bold flex flex-row gap-5 underline">
                     <TvMinimalPlay size={45} /> Animes
                  </h1>
               </header>
               <section className="w-auto grid gap-5 shadow-2xl md:rounded-2xl rounded-none dark:bg-gray-700 p-6">
                  <h1 className="text-2xl font-bold  text-center">
                     Explora en la Lista de Animes de{" "}
                     {name
                        ? username === name
                           ? username
                           : name?.toLowerCase()
                        : ""}
                  </h1>
                  <SearchForm
                     filtersParam={filtersParam}
                     setFiltersParam={setFiltersParam}
                     setPage={setPage}
                     tipoContenido={TipoContenidoEnum.anime}
                  />
                  <TabMenuStatusView
                     isAnime={true}
                     loading={loading}
                     filtersParam={filtersParam}
                     setFiltersParams={setFiltersParam}
                     setPage={setPage}
                  />
               </section>
               {loading ? (
                  <PaginationSkeleton />
               ) : (
                  <section className="w-auto grid gap-5 shadow-2xl md:rounded-2xl rounded-none dark:bg-gray-700 p-6">
                     {totalAnimes > 0 && (
                        <p className=" font-bold text-lg m-2  p-2 w-full text-black dark:text-white justify-center items-center">
                           Mostrando {totalAnimes} anime(s).
                        </p>
                     )}
                     <AnimePagination
                        page={page}
                        total={totalAnimes}
                        setLoading={setLoaging}
                        setPage={setPage}
                        animes={animes}
                     />
                  </section>
               )}
            </>
         )}
      </main>
   );
}
