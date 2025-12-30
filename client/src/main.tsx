import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { PrimeReactProvider } from "primereact/api";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <BrowserRouter>
         <PrimeReactProvider>
            <App />
         </PrimeReactProvider>
      </BrowserRouter>
   </StrictMode>
);
