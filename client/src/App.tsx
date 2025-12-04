import { lazy, Suspense } from "react";
import "./App.css";

import { Header } from "./components/Header.tsx";
import { Route, Routes } from "react-router";
import { Footer } from "./components/Footer.tsx";
import { ToastNotif } from "./components/ToastNotif.tsx";
const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.tsx"));
const NotFoundPage = lazy(() => import("./pages/404.tsx"));

function App() {
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
               <Route path="*" element={<NotFoundPage />} />
            </Routes>
         </Suspense>
         <ToastNotif />
         <Footer />
      </>
   );
}

export default App;
