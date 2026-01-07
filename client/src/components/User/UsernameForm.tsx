import { Button, Spinner, TextInput } from "flowbite-react";
import { authStore } from "../../store/authStore";
import { useState, type FormEvent } from "react";
import { RespPayCngUsernameZ } from "../../schemas/userSchemas";
import { toastStore } from "../../store/toastStore";
import { changeUsernane } from "../../services/userServices";

export function UsernameForm() {
   const { username, setUsername } = authStore();
   const showToast = toastStore((s) => s.showToast);
   const [loading, setLoading] = useState<boolean>(false);

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const name = String(formData.get("username") ?? "");
      if (name.trim().toLowerCase() === username) return;
      setLoading(true);

      const parsed = RespPayCngUsernameZ.safeParse({
         new_name: name.trim().toLowerCase(),
         old_name: username,
      });
      if (!parsed.success) {
         showToast({
            severity: "error",
            summary: "Error",
            detail: parsed.error.issues[0].message,
         });
         setLoading(false);
      } else {
         changeUsernane({ ...parsed.data })
            .then((resp) => {
               showToast({
                  severity: resp.is_success ? "success" : "error",
                  summary: resp.is_success ? "Exito" : "Error",
                  detail: resp.msg,
               });
               if (resp.is_success) {
                  setUsername(resp.new_name ?? "");
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
                     "Ocurrió un error al intentar cambiar el nombre de usuario.",
               });
               setLoading(false);
            });
      }
   };

   return (
      <>
         <h3 className="text-lg font-semibold">Cambio de Nombre de Usuario:</h3>
         <form
            className="flex flex-col md:flex-row  gap-4 align-middle w-full"
            onSubmit={handleSubmit}
         >
            <TextInput
               className="w-full md:w-[70%]"
               id="username"
               name="username"
               type="text"
               defaultValue={username ?? ""}
               placeholder="Nombre de usuario"
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
