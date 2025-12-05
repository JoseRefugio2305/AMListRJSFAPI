import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { authStore } from "../store/authStore";
import { useState, type FormEvent } from "react";
import { toastStore } from "../store/toastStore";

export function Register() {
   const { login } = authStore();
   const showToast = toastStore((s) => s.showToast);

   const [loading, setLoading] = useState<boolean>(false);

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      const formData = new FormData(event.currentTarget);
      const name = String(formData.get("username") ?? "");
      const email = String(formData.get("emailReg") ?? "");
      const password = String(formData.get("passwordReg") ?? "");
      login({ name, email, password }, false)
         .then((response) => {
            showToast({
               severity: response.is_success ? "success" : "error",
               summary: response.is_success ? "Exito" : "Error",
               detail: response.message,
            });
         })
         .catch((error) => {
            console.log(error);
            showToast({
               severity: "error",
               summary: "Error",
               detail: "Ocurrio un error al procesar la petición.",
            });
         })
         .finally(() => setLoading(false));
   };

   return (
      <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit}>
         <div>
            <div className="mb-2 block">
               <Label htmlFor="username">Username: </Label>
            </div>
            <TextInput
               id="username"
               name="username"
               type="text"
               placeholder="Nombre de Usuario"
               required
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label htmlFor="emailReg">Email: </Label>
            </div>
            <TextInput
               id="emailReg"
               name="emailReg"
               type="emailReg"
               placeholder="name@mail.com"
               required
            />
         </div>
         <div>
            <div className="mb-2 block">
               <Label htmlFor="passwordReg">Contraseña: </Label>
            </div>
            <TextInput
               id="passwordReg"
               name="passwordReg"
               type="password"
               required
               placeholder="Contraseña"
            />
         </div>
         <Button type="submit" disabled={loading} color="purple">
            {loading ? (
               <>
                  <Spinner
                     size="sm"
                     aria-label="Info spinner example"
                     className="me-3"
                     light
                  />
                  Loading...
               </>
            ) : (
               "Aceptar"
            )}
         </Button>
      </form>
   );
}
