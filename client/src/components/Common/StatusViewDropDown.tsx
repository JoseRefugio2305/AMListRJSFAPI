import {
   Dropdown,
   DropdownDivider,
   DropdownItem,
   Spinner,
} from "flowbite-react";
import { getStatusViewStr } from "../../utils/common";
import type { StatusViewEnum } from "../../types/animeTypes";
import { authStore } from "../../store/authStore";
import { toastStore } from "../../store/toastStore";
import { useState } from "react";
import { changeFavStatus } from "../../services/favServices";

interface SVDropDownProps {
   is_anime: boolean;
   fav_id: string;
   statusView: StatusViewEnum;
   setStatusView: React.Dispatch<React.SetStateAction<number>>;
   className?: string;
}

export function StatusViewDropDown({
   is_anime,
   fav_id,
   statusView,
   setStatusView,
   className,
}: SVDropDownProps) {
   const username = authStore((s) => s.username);
   const showToast = toastStore((s) => s.showToast);
   const ruta = is_anime ? "/anime/" : "/manga/";
   const [loading, setLoaging] = useState<boolean>(false);

   const handleStatusChange = (new_status: number) => {
      if (username && !loading) {
         setLoaging(true);
         changeFavStatus(ruta + "changeFavStatus", {
            animeId: is_anime ? fav_id : undefined,
            mangaId: !is_anime ? fav_id : undefined,
            statusView: new_status,
            active: true,
         })
            .then((resp) => {
               showToast({
                  severity: resp.is_success ? "success" : "error",
                  summary: resp.is_success ? "Exito" : "Error",
                  detail: resp.is_success
                     ? "Estado cambiado correctamente."
                     : "Error al intentar cambiar el estado de visualización.",
               });
               if (resp.is_success) {
                  setStatusView(resp?.statusView ?? 5);
               }
               setLoaging(false);
            })
            .catch((error) => {
               setLoaging(false);
               console.error(error);
               showToast({
                  severity: "error",
                  summary: "Error",
                  detail:
                     "Error al intentar cambiar el estado de visualización.",
               });
            });
      } else {
         showToast({
            severity: "error",
            summary: "Error",
            detail: "Debes iniciar sesión para llevar a cabo esta accion.",
         });
      }
   };
   return (
      <div className={`w-full relative ${className}`}>
         <Dropdown
            label={
               !loading ? (
                  `Estado: ${getStatusViewStr(statusView, is_anime)}`
               ) : (
                  <Spinner color="purple" aria-label="Loading status view" />
               )
            }
            disabled={loading}
            className="rounded-sm mx-0 w-full bg-purple-500 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-700 focus:ring-purple-300 dark:focus:ring-purple-300"
            style={{ width: "100%" }}
         >
            <DropdownItem
               onClick={() => handleStatusChange(1)}
               className="w-full text-left text-white hover:bg-purple-700 focus:bg-purple-500 dark:hover:bg-purple-700 dark:focus:bg-purple-500"
            >
               {is_anime?"Viendo":"Leyendo"}
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
               onClick={() => handleStatusChange(6)}
               className="w-full text-left text-white hover:bg-purple-700 focus:bg-purple-500 dark:hover:bg-purple-700 dark:focus:bg-purple-500"
            >
               Completado
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
               onClick={() => handleStatusChange(2)}
               className="w-full text-left text-white hover:bg-purple-700 focus:bg-purple-500 dark:hover:bg-purple-700 dark:focus:bg-purple-500"
            >
               Pendiente
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
               onClick={() => handleStatusChange(3)}
               className="w-full text-left text-white hover:bg-purple-700 focus:bg-purple-500 dark:hover:bg-purple-700 dark:focus:bg-purple-500"
            >
               Considerando
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
               onClick={() => handleStatusChange(4)}
               className="w-full text-left text-white hover:bg-purple-700 focus:bg-purple-500 dark:hover:bg-purple-700 dark:focus:bg-purple-500"
            >
               Abandonado
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem
               onClick={() => handleStatusChange(5)}
               className="w-full text-left text-white hover:bg-purple-700 focus:bg-purple-500 dark:hover:bg-purple-700 dark:focus:bg-purple-500"
            >
               Ninguno
            </DropdownItem>
         </Dropdown>
      </div>
   );
}
