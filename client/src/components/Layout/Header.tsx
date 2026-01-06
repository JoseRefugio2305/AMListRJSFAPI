import {
   Avatar,
   Dropdown,
   DropdownDivider,
   DropdownHeader,
   DropdownItem,
   Navbar,
   NavbarBrand,
   NavbarCollapse,
   NavbarToggle,
} from "flowbite-react";
import { NavLink, useNavigate } from "react-router";
import amlLogo from "/logo.png";
import { ButtonToggleTheme } from "./ButtonToggleTheme";
import {
   ArrowRightToLine,
   Bolt,
   Brush,
   House,
   ListCollapse,
   Telescope,
   TvMinimalPlay,
   UserPlus,
} from "lucide-react";
import { authStore } from "../../store/authStore";

function AvatarSettings() {
   const { username, logout, prof_pic } = authStore();
   const navigate = useNavigate();
   return (
      <div className="flex md:order-2 dark:text-white">
         <Dropdown
            arrowIcon={false}
            inline
            label={
               <div className="flex gap-1 justify-center items-center">
                  <Avatar
                     alt={`Foto de perfil de ${username}`}
                     img={prof_pic ?? "/avatars/not_found.png"}
                     rounded
                  />
                  <span className="hidden sm:flex">{username}</span>
               </div>
            }
         >
            <DropdownHeader>
               <span className="block text-sm">{username}</span>
            </DropdownHeader>
            <DropdownDivider />
            <DropdownItem
               icon={ListCollapse}
               onClick={() => navigate(`user/${username}/lists`)}
            >
               Mis Listas
            </DropdownItem>
            <DropdownItem
               icon={Bolt}
               onClick={() => navigate(`user/${username}/lists`)}
            >
               Configuración
            </DropdownItem>
            <DropdownItem
               icon={ArrowRightToLine}
               onClick={() => logout(navigate)}
            >
               Cerrar Sesión
            </DropdownItem>
         </Dropdown>
      </div>
   );
}

export function Header() {
   const username = authStore((s) => s.username);

   return (
      <header>
         <Navbar fluid className="shadow-md z-10">
            <NavbarBrand href="/">
               <img
                  src={amlLogo}
                  className="mr-3 h-10 sm:h-15 md:h-25"
                  alt="AniMangaList Logo"
               />
               <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                  AniMangaList
               </span>
            </NavbarBrand>
            {username && <AvatarSettings />}
            <NavbarToggle />
            <NavbarCollapse>
               <NavLink
                  className={({ isActive }) =>
                     isActive ? "nav-link-active nav-link" : "nav-link"
                  }
                  to="/"
               >
                  <House /> Home
               </NavLink>
               <NavLink
                  className={({ isActive }) =>
                     isActive ? "nav-link-active nav-link" : "nav-link"
                  }
                  to="/anime"
               >
                  <TvMinimalPlay /> Animes
               </NavLink>
               <NavLink
                  className={({ isActive }) =>
                     isActive ? "nav-link-active nav-link" : "nav-link"
                  }
                  to="/manga"
               >
                  <Brush /> Mangas
               </NavLink>
               <NavLink
                  className={({ isActive }) =>
                     isActive ? "nav-link-active nav-link" : "nav-link"
                  }
                  to="/explore"
               >
                  <Telescope /> Explorar
               </NavLink>
               {!username && (
                  <NavLink
                     className={({ isActive }) =>
                        isActive ? "nav-link-active nav-link" : "nav-link"
                     }
                     to="/login"
                  >
                     <UserPlus /> Iniciar Sesión / Registrarse
                  </NavLink>
               )}
               <ButtonToggleTheme />
            </NavbarCollapse>
         </Navbar>
      </header>
   );
}
