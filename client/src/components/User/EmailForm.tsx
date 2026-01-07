import { Button, Spinner, TextInput } from "flowbite-react";
import { useState, type FormEvent } from "react";
import { RespPayCngEmailZ } from "../../schemas/userSchemas";
import { toastStore } from "../../store/toastStore";
import { changeEmail } from "../../services/userServices";
import { authStore } from "../../store/authStore";

interface EmailFormProps {
   email: string;
}

export function EmailForm({ email }: EmailFormProps) {
   const showToast = toastStore((s) => s.showToast);
   const { setEmail } = authStore();
   const [actualEmail, setActualEmail] = useState<string>(email);
   const [loading, setLoading] = useState<boolean>(false);

   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const new_email = String(formData.get("email") ?? "");
      if (new_email.trim().toLowerCase() === actualEmail) return;
      setLoading(true);

      const parsed = RespPayCngEmailZ.safeParse({
         new_email: new_email.trim().toLowerCase(),
         old_email: actualEmail,
         access_token: "",
      });
      if (!parsed.success) {
         showToast({
            severity: "error",
            summary: "Error",
            detail: parsed.error.issues[0].message,
         });
         setLoading(false);
      } else {
         changeEmail({ ...parsed.data })
            .then((resp) => {
               showToast({
                  severity: resp.is_success ? "success" : "error",
                  summary: resp.is_success ? "Exito" : "Error",
                  detail: resp.msg,
               });
               if (resp.is_success) {
                  setActualEmail(resp.new_email ?? email);
                  setEmail(resp.access_token ?? "");
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
                     "Ocurrió un error al intentar cambiar el email de usuario.",
               });
               setLoading(false);
            });
      }
   };

   return (
      <>
         <h3 className="text-lg font-semibold">Cambio de Email de Usuario:</h3>
         <form
            className="flex flex-col md:flex-row  gap-4 align-middle w-full"
            onSubmit={handleSubmit}
         >
            <TextInput
               className="w-full md:w-[70%]"
               id="email"
               name="email"
               type="email"
               defaultValue={email}
               placeholder="Email"
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
