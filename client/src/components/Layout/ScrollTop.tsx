import { useEffect } from "react";
import { useLocation } from "react-router";
import { ScrollTop as ScrollTopPrime } from "primereact/scrolltop";

export function ScrollTop() {
   const { pathname } = useLocation();

   useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
   }, [pathname]);

   return <ScrollTopPrime />;
}
