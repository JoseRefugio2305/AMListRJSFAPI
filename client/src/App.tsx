import { lazy, Suspense } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";

import { Header } from "./components/Header.tsx";
const HomePage = lazy(() => import("./pages/HomePage.tsx"));
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
            <BrowserRouter>
               <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="*" element={<NotFoundPage />} />
               </Routes>
            </BrowserRouter>
         </Suspense>
      </>
   );
}

export default App;
