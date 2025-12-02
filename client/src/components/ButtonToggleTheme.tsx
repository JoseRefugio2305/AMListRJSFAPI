import { Label, ToggleSwitch } from "flowbite-react";
import { themeStore } from "../store/themeStore";
import { Moon, Sun } from "lucide-react";

export function ButtonToggleTheme() {
   const { theme, toggleTheme } = themeStore();
   return (
      <>
         <div className="flex items-center gap-2">
            <ToggleSwitch
               id="toggle-switch-theme"
               checked={theme === "dark" ? true : false}
               onChange={() =>
                  toggleTheme(theme === "light" ? "dark" : "light")
               }
               color="purple"
            />
            <Label
               htmlFor="toggle-switch-theme"
               className="flex items-center gap-2"
            >
               {theme === "dark" ? <Sun /> : <Moon />}
            </Label>
         </div>
      </>
   );
}
