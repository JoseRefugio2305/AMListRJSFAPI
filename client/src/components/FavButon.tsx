import { Button } from "flowbite-react";
import { Heart, HeartPlus } from "lucide-react";
import { authStore } from "../store/authStore";
import { toastStore } from "../store/toastStore";
import { changeFavStatus } from "../services/favServices";

interface FavButtonProps {
   is_anime: boolean;
   fav_id: string;
   fav_status: boolean;
   setFav: React.Dispatch<React.SetStateAction<boolean>>;
   className?: string;
}

export function FavButton({
   is_anime,
   fav_id,
   fav_status,
   setFav,
   className,
}: FavButtonProps) {
   const username = authStore((s) => s.username);
   const showToast = toastStore((s) => s.showToast);
   const ruta = is_anime ? "/anime/" : "/manga/";

   const handleFav = () => {
      if (username) {
         changeFavStatus(ruta + "changeFavStatus/", {
            animeId: is_anime ? fav_id : undefined,
            mangaId: !is_anime ? fav_id : undefined,
            statusView: 5,
            active: !fav_status,
         })
            .then((resp) => {
               showToast({
                  severity: resp.is_success ? "success" : "error",
                  summary: resp.is_success ? "Exito" : "Error",
                  detail: resp.msg,
               });
               if (resp.is_success) {
                  setFav(!fav_status);
               }
            })
            .catch((error) => {
               console.error(error);
               showToast({
                  severity: "error",
                  summary: "Error",
                  detail: "Error al intentar agregar a favoritos.",
               });
            });
      } else {
         showToast({
            severity: "error",
            summary: "Error",
            detail: "Debes iniciar sesión para agregar a favoritos.",
         });
      }
   };

   return (
      <Button
         onClick={handleFav}
         outline={!fav_status}
         color="red"
         className={`z-10 mb-5 ${className}`}
      >
         {fav_status ? <Heart /> : <HeartPlus />}
      </Button>
   );
}
