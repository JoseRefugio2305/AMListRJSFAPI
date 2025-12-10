import { lazy, Suspense } from "react";
import "./App.css";

import { Header } from "./components/Layout/Header.tsx";
import { Route, Routes } from "react-router";
import { Footer } from "./components/Layout/Footer.tsx";
import { ToastNotif } from "./components/Layout/ToastNotif.tsx";
import { usePrimeReactTheme } from "./hooks/usePrimeReactTheme.ts";
const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.tsx"));
const AnimePage = lazy(() => import("./pages/AnimePage.tsx"));
const NotFoundPage = lazy(() => import("./pages/404.tsx"));

function App() {
   usePrimeReactTheme()
   return (
      <>
         <Header />
         <Suspense
            fallback={
               <div
                  style={{
                     maxWidth: "1280px",
                     margin: "0 auto",
                     padding: "0 1rem",
                  }}
               >
                  Cargando...
               </div>
            }
         >
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="/login" element={<AuthPage />} />
               <Route path="/anime" element={<AnimePage />} />
               <Route path="*" element={<NotFoundPage />} />
            </Routes>
         </Suspense>
         <ToastNotif />
         <Footer />
      </>
   );
}

export default App;
