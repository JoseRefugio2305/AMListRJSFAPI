import { Card, TabItem, Tabs } from "flowbite-react";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { authStore } from "../store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AuthPage() {
   const username = authStore((s) => s.username);
   const navigate = useNavigate();

   useEffect(() => {
      if (username) {
         navigate("/");
      }
   }, [username, navigate]);

   return (
      <>
         <main className="min-h-screen flex h-screen items-center justify-center">
            <Card className="w-full max-w-md md:max-w-lg lg:max-w-1xl dark:text-white shadow-2xl">
               <Tabs className="w-full justify-center">
                  <TabItem active title="Iniciar Sesión">
                     <Login />
                  </TabItem>
                  <TabItem active title="Registrarse">
                     <Register />
                  </TabItem>
               </Tabs>
            </Card>
         </main>
      </>
   );
}
