import {
   Avatar,
   Button,
   Dropdown,
   DropdownDivider,
   DropdownHeader,
   DropdownItem,
   Navbar,
   NavbarBrand,
   NavbarCollapse,
   NavbarToggle,
} from "flowbite-react";
import { NavLink } from "react-router";
import viteLogo from "/vite.svg";
import { ButtonToggleTheme } from "./ButtonToggleTheme";
import { House, UserPlus } from "lucide-react";
import { authStore } from "../store/authStore";

export function Header() {
   const { username, logout } = authStore();
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
            <div className="flex md:order-2">
               <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                     <Avatar
                        alt="User settings"
                        img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                        rounded
                     />
                  }
               >
                  <DropdownHeader>
                     <span className="block text-sm">Bonnie Green</span>
                     <span className="block truncate text-sm font-medium">
                        name@flowbite.com
                     </span>
                  </DropdownHeader>
                  <DropdownItem>Dashboard</DropdownItem>
                  <DropdownItem>Settings</DropdownItem>
                  <DropdownItem>Earnings</DropdownItem>
                  <DropdownDivider />
                  <DropdownItem>Sign out</DropdownItem>
               </Dropdown>
               <NavbarToggle />
            </div>
            <NavbarCollapse>
               <NavLink
                  className={({ isActive }) =>
                     isActive ? "nav-link-active nav-link" : "nav-link"
                  }
                  to="/"
               >
                  <House /> Home
               </NavLink>
               {!username ? (
                  <NavLink
                     className={({ isActive }) =>
                        isActive ? "nav-link-active nav-link" : "nav-link"
                     }
                     to="/login"
                  >
                     <UserPlus /> Iniciar Sesión / Registrarse
                  </NavLink>
               ) : (
                  <Button onClick={() => logout()}>Cerrar Sesión</Button>
               )}
               <ButtonToggleTheme />
            </NavbarCollapse>
         </Navbar>
      </header>
   );
}
