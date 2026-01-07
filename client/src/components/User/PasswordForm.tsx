import { Button, Spinner, TextInput } from "flowbite-react";
import { useId, useState, type FormEvent } from "react";
import { RespPayCngPassZ } from "../../schemas/userSchemas";
import { toastStore } from "../../store/toastStore";
import { changePass } from "../../services/userServices";

export function PasswordForm() {
   const idOldPass = useId();
   const idNewPass = useId();
   const showToast = toastStore((s) => s.showToast);
   const [loading, setLoading] = useState<boolean>(false);

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newPass = String(formData.get(idNewPass));
      const oldPass = String(formData.get(idOldPass));
      if (!newPass.trim() || !oldPass.trim()) return;
      setLoading(true);

      const parsed = RespPayCngPassZ.safeParse({
         new_pass: newPass,
         old_pass: oldPass,
      });
      if (!parsed.success) {
         showToast({
            severity: "error",
            summary: "Error",
            detail: parsed.error.issues[0].message,
         });
         setLoading(false);
      } else {
         changePass({ ...parsed.data })
            .then((resp) => {
               showToast({
                  severity: resp.is_success ? "success" : "error",
                  summary: resp.is_success ? "Exito" : "Error",
                  detail: resp.msg,
               });
               if (resp.is_success) {
                  setTimeout(() => {
                     window.location.reload();
                  }, 1000);
               }
               setLoading(false);
            })
            .catch((error) => {
               console.error(error);
               showToast({
                  severity: "error",
                  summary: "Error",
                  detail:
                     "Ocurrió un error al intentar cambiar la contraseña de usuario.",
               });
               setLoading(false);
            });
      }
   };

   return (
      <>
         <h3 className="text-lg font-semibold">
            Cambio de Contraseña de Usuario:
         </h3>
         <form
            className="flex flex-col md:flex-row  gap-4 align-middle w-full"
            onSubmit={handleSubmit}
         >
            <TextInput
               className="w-full md:w-[70%]"
               id={idOldPass}
               name={idOldPass}
               type="password"
               placeholder="Ingresa la Antigua Contraseña"
               required
               disabled={loading}
            />
            <TextInput
               className="w-full md:w-[70%]"
               id={idNewPass}
               name={idNewPass}
               type="password"
               placeholder="Ingresa la Nueva Contraseña"
               required
               disabled={loading}
            />
            <Button
               className="w-full md:w-[27%]"
               type="submit"
               disabled={loading}
               color="purple"
            >
               {loading ? (
                  <>
                     <Spinner
                        size="sm"
                        aria-label="Info spinner example"
                        className="me-3"
                        light
                     />
                     Cargando...
                  </>
               ) : (
                  "Cambiar"
               )}
            </Button>
         </form>
      </>
   );
}
