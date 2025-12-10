import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { PrimeReactProvider } from "primereact/api";

createRoot(document.getElementById("root")!).render(
   <BrowserRouter>
      <PrimeReactProvider>
         <App />
      </PrimeReactProvider>
   </BrowserRouter>
);
