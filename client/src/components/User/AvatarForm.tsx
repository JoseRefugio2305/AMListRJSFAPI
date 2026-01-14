import { useState } from "react";
import { authStore } from "../../store/authStore";
import { changeProfilePic } from "../../services/userServices";
import { CircleX, UserPen } from "lucide-react";
import { Avatar, Button, Spinner } from "flowbite-react";
import { toastStore } from "../../store/toastStore";
import { avatarsOptions } from "../../types/userTypes";

interface AvatarFormProps {
   actualAvatar: number;
}

export function AvatarForm({ actualAvatar }: AvatarFormProps) {
   const { username, prof_pic, setProfPic } = authStore();
   const showToast = toastStore((s) => s.showToast);

   const [loading, setLoading] = useState<boolean>(false);

   const [showAvatars, setShowAvatars] = useState<boolean>(false);
   const [actAvatar, setActAvatar] = useState<number>(actualAvatar);
   const [avatarSel, setSelAvatar] = useState<number>(actualAvatar);

   const handleChangePP = () => {
      if (avatarSel !== actAvatar) {
         setLoading(true);
         setShowAvatars(false);
         changeProfilePic({ profile_pic: avatarSel })
            .then((resp) => {
               showToast({
                  severity: resp.is_success ? "success" : "error",
                  summary: resp.is_success ? "Exito" : "Error",
                  detail: resp.msg,
               });
               if (resp.is_success) {
                  setSelAvatar(resp.profile_pic ?? 1);
                  setProfPic(resp.profile_pic ?? 1);
                  setActAvatar(resp.profile_pic ?? 1);
                  setTimeout(() => {
                     window.location.reload();
                  }, 1000);
               } else {
                  setSelAvatar(actualAvatar ?? 1);
               }

               setLoading(false);
            })
            .catch((error) => {
               console.error(error);
               showToast({
                  severity: "error",
                  summary: "Error",
                  detail:
                     "Ocurrió un error al intentar cambiar el avatar de perfil.",
               });
               setLoading(false);
               setSelAvatar(actualAvatar ?? 1);
               setShowAvatars(true);
            });
      } else {
         setShowAvatars(false);
      }
   };

   return (
      <>
         <Avatar
            alt={`Foto de perfil de ${username}`}
            img={prof_pic ?? "/avatars/not_found.png"}
            rounded
            size="xl"
            bordered
            color="purple"
         />
         <Button
            color="purple"
            pill
            className="w-fit px-3 py-6"
            onClick={() => setShowAvatars(!showAvatars)}
            disabled={loading}
         >
            {loading ? (
               <Spinner aria-label="Loading..." size="md" light />
            ) : showAvatars ? (
               <CircleX />
            ) : (
               <UserPen />
            )}
         </Button>

         <div
            aria-hidden={!showAvatars}
            className={`overflow-hidden transition-all duration-500 ease-in-out flex flex-col items-center
               ${
                  showAvatars
                     ? "max-h-[800px] opacity-100 translate-y-0 pointer-events-auto"
                     : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
               }`}
         >
            <h3 className="text-md font-semibold text-center">
               Selecciona un avatar
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 justify-center items-center rounded-full">
               {avatarsOptions.map((avatar) => (
                  <Avatar
                     alt={`Foto de perfil de ${username}`}
                     img={avatar.img}
                     rounded
                     size="lg"
                     key={avatar.code}
                     onClick={() => setSelAvatar(avatar.code)}
                     className={`cursor-pointer hover:scale-90 duration-200 hover:border-5 hover:border-purple-600 rounded-full h-25 w-25 ${
                        avatarSel === avatar.code && "border-5 border-green-600"
                     }`}
                  />
               ))}
            </div>
            <Button
               color="purple"
               pill
               className="w-fit"
               onClick={handleChangePP}
            >
               Aplicar Cambio
            </Button>
         </div>
      </>
   );
}
