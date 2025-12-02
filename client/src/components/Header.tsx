import { Navbar, NavbarBrand } from "flowbite-react";
import viteLogo from "/vite.svg";
import { ButtonToggleTheme } from "./ButtonToggleTheme";

export function Header() {
   return (
      <header>
         <Navbar fluid className="shadow-md z-10">
            <NavbarBrand href="/">
               <img
                  src={viteLogo}
                  className="mr-3 h-6 sm:h-9"
                  alt="Flowbite React Logo"
               />
               <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                  Flowbite React
               </span>
            </NavbarBrand>
            <ButtonToggleTheme />
         </Navbar>
      </header>
   );
}
