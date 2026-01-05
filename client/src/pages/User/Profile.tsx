import { Link, Navigate, useNavigate, useParams } from "react-router";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { authStore } from "../../store/authStore";
import { useEffect, useState } from "react";
import { getUserDataProfile } from "../../services/userServices";
import type { UserProfileSchema } from "../../schemas/userSchemas";
import { Avatar } from "flowbite-react";
import { DetailsSkeleton } from "../../components/Skeletons/DetailsSkeleton";
import { CarouselAnime } from "../../components/Anime/CarouselAnime";
import { CarouselManga } from "../../components/Manga/CarouselManga";
import { StatsProfileSection } from "../../components/User/StatsProfileSection";

export default function Profile() {
   const navigate = useNavigate();
   const [isOwnProfile, setIsOwnProf] = useState<boolean>(false);
   const { username } = authStore();
   const { name } = useParams();
   const [userData, setUserData] = useState<UserProfileSchema | null>(null);
   const [loadingUserData, setLoadingUserData] = useState<boolean>(true);

   useEffect(() => {
      const fetchUserData = () => {
         const own = name?.trim().toLowerCase() === username;
         setIsOwnProf(own);
         setLoadingUserData(true);
         getUserDataProfile(own ? username ?? "" : name?.toLowerCase() ?? "")
            .then((resp) => {
               if (!resp) {
                  navigate("/404-not-found", { replace: true });
                  return;
               }

               setUserData(resp);
               setLoadingUserData(false);
            })
            .catch((error) => {
               console.error(error);
               navigate("/404-not-found", { replace: true });
            });
      };
      fetchUserData();
   }, [name]);

   if (!name?.toLowerCase() && !username) {
      //TODO: Solo ver si existe name agregar un return
      return <Navigate to="/404-not-found" replace />;
   }
   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 pb-14 mt-5 min-h-screen">
         {loadingUserData ? (
            <DetailsSkeleton />
         ) : (
            <div className="flex flex-col gap-3">
               <Breadcrumbs
                  items={[
                     { label: "Home", to: "/" },
                     { label: "Usuario" },
                     { label: name ?? "" },
                  ]}
               />
               <h1 className="text-3xl font-bold underline  mx-auto px-5">
                  {isOwnProfile
                     ? "Mi Perfil"
                     : `Perfil de ${name?.toLowerCase()}`}
               </h1>
               <div className="flex flex-col sm:flex-row w-full p-0">
                  <section className="w-full md:w-[40%] flex flex-col items-center mb-4 gap-3">
                     <Avatar
                        img={
                           userData
                              ? `/avatars/${userData?.profile_pic}.png`
                              : "/avatars/not_found.png"
                        }
                        rounded
                        bordered
                        color="purple"
                        size="xl"
                     />
                     <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700 w-[70%] flex flex-col gap-1">
                        <p className="text-md mb-3">
                           <b>{userData?.name}</b>
                        </p>
                        <p className="text-md mb-3">
                           <b>Se unió el:</b> {userData?.created_date}
                        </p>
                        <Link
                           to={`/user/${name?.toLowerCase()??""}/animelist`}
                           className="hover:underline hover:text-white font-semibold text-md bg-purple-500 rounded-lg px-2 py-1 w-full justify-center flex items-center text-white mb-3"
                        >
                           Lista de Animes
                        </Link>
                        <Link
                           to="/lista" //TODO: Crear ruta de listado de mangas favoritos
                           className="hover:underline hover:text-white font-semibold text-md bg-purple-500 rounded-lg px-2 py-1 w-full justify-center flex items-center text-white mb-3"
                        >
                           Lista de Mangas
                        </Link>
                     </div>
                  </section>
                  <section className="md:w-[60%] mx-auto w-full flex flex-col mb-4 gap-3">
                     <div className="shadow-2xl rounded-2xl p-5 bg-white dark:bg-gray-700 text-black dark:text-white">
                        <StatsProfileSection name={name ?? ""} />
                     </div>
                  </section>
               </div>
               <CarouselAnime
                  isEmision={false}
                  onlyFavs={true}
                  username={name ?? ""}
                  isOwnProfile={isOwnProfile}
               />
               <CarouselManga
                  isPublicacion={false}
                  onlyFavs={true}
                  username={name ?? ""}
                  isOwnProfile={isOwnProfile}
               />
            </div>
         )}
      </main>
   );
}
