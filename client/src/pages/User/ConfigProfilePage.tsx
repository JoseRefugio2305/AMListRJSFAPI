import { useEffect, useState } from "react";
import { authStore } from "../../store/authStore";
import { getUserDataProfile } from "../../services/userServices";
import { useNavigate } from "react-router";
import type { UserProfileSchema } from "../../schemas/userSchemas";
import { Breadcrumbs } from "../../components/Layout/BreadCrumbs";
import { CircleUserRoundIcon } from "lucide-react";
import { AvatarForm } from "../../components/User/AvatarForm";
import { UsernameForm } from "../../components/User/UsernameForm";
import { EmailForm } from "../../components/User/EmailForm";
import { PasswordForm } from "../../components/User/PasswordForm";
import { ConfigProfileSkeleton } from "../../components/Skeletons/ConfigProfileSkeleton";

export default function ConfigProfilePage() {
   const { username } = authStore();

   const navigate = useNavigate();

   const [loading, setLoading] = useState<boolean>(true);
   const [userData, setUserData] = useState<UserProfileSchema | null>(null);

   useEffect(() => {
      const fetchUserData = () => {
         setLoading(true);
         if (username) {
            getUserDataProfile(username ?? "", true)
               .then((resp) => {
                  if (!resp) {
                     navigate("/login", { replace: true });
                     return;
                  }

                  setUserData(resp);
                  setLoading(false);
               })
               .catch((error) => {
                  console.error(error);
                  navigate("/login", { replace: true });
               });
         } else {
            navigate("/login", { replace: true });
         }
      };
      fetchUserData();
   }, [username]);

   return (
      <main className="max-w-5xl mx-auto space-y-8 py-5 pb-14 mt-5 min-h-screen">
         {loading && !userData ? (
            <ConfigProfileSkeleton />
         ) : (
            <>
               <header>
                  <Breadcrumbs
                     items={[
                        { label: "Home", to: "/" },
                        { label: "Usuario" },
                        {
                           label: username ?? "",
                           to: `/user/${username}/lists`,
                        },
                        { label: "Configuración" },
                     ]}
                  />
                  <h1 className="text-5xl font-bold flex flex-row gap-5 underline">
                     <CircleUserRoundIcon size={45} /> {username}
                  </h1>
               </header>
               <section className="w-[85%] mx-auto  flex flex-col justify-center items-center  gap-5 shadow-2xl rounded-2xl dark:bg-gray-700 p-6">
                  <AvatarForm actualAvatar={userData?.profile_pic ?? 1} />
               </section>
               <section className="w-[85%] mx-auto  flex flex-col justify-center items-center  gap-5 shadow-2xl rounded-2xl dark:bg-gray-700 p-6">
                  <UsernameForm />
               </section>
               <section className="w-[85%] mx-auto  flex flex-col justify-center items-center  gap-5 shadow-2xl rounded-2xl dark:bg-gray-700 p-6">
                  <EmailForm email={userData?.email ?? ""} />
               </section>
               <section className="w-[85%] mx-auto  flex flex-col justify-center items-center  gap-5 shadow-2xl rounded-2xl dark:bg-gray-700 p-6">
                  <PasswordForm />
               </section>
            </>
         )}
      </main>
   );
}
