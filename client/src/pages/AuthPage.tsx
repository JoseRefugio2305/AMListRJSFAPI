import { Card, TabItem, Tabs, type TabsRef } from "flowbite-react";
import { Login } from "../components/Login";
import { Register } from "../components/Register";
import { authStore } from "../store/authStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

export default function AuthPage() {
   const username = authStore((s) => s.username);
   const navigate = useNavigate();

   const tabsRef = useRef<TabsRef>(null);
   const [activeTab, setActiveTab] = useState<number>(0);

   useEffect(() => {
      if (username) {
         navigate("/");
      }
   }, [username, navigate]);

   return (
      <>
         <main className="min-h-screen flex h-screen items-center justify-center">
            <Card className="w-full max-w-md md:max-w-lg lg:max-w-1xl dark:text-white shadow-2xl">
               <Tabs
                  className="w-full justify-center"
                  ref={tabsRef}
                  onActiveTabChange={(tab) => setActiveTab(tab)}
               >
                  <TabItem active title="Iniciar Sesión">
                     <Login />
                  </TabItem>
                  <TabItem title="Registrarse">
                     <Register />
                  </TabItem>
               </Tabs>
               <p>
                  {activeTab === 0
                     ? "¿No tienes una cuenta?, "
                     : "¿Ya tienes una cuenta?, "}
                  <a
                     onClick={() =>
                        tabsRef.current?.setActiveTab(activeTab === 0 ? 1 : 0)
                     }
                     className="nav-link-active "
                     style={{ cursor: "pointer" }}
                  >
                     {activeTab === 0 ? "registrate" : "inicia sesión "}
                  </a>
               </p>
            </Card>
         </main>
      </>
   );
}
