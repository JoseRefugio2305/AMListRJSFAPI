import { useEffect } from 'react';
import { themeStore } from '../store/themeStore';

//Hook para comprobar el thema seleccionado por el usuario y asi cambiar los estilos de primereact de light a dark
export function usePrimeReactTheme() {
  const theme = themeStore((s) => s.theme);

  useEffect(() => {
    //Revisamos si ya existe algun elemento con los estilos de primereact
    const existingLink = document.querySelector('link#primereact-theme') as HTMLLinkElement | null

    // Determinar el tema según el store
    const themeFile = theme === 'dark'
      ? '/themes/lara-dark-indigo/theme.css'
      : '/themes/lara-light-indigo/theme.css';

    //Si no existe un link con los estilos de primereact lo agregamos dependiendo de la store
    if (!existingLink) {
      const link = document.createElement('link');
      link.id = 'primereact-theme';
      link.rel = 'stylesheet';
      link.href = new URL(themeFile, import.meta.url).href;
      document.head.appendChild(link);
      // existingLink.remove();
    } else {
      //Si ya existe el elemento cambiamos su href dependiendo del estore
      existingLink.href = new URL(themeFile, import.meta.url).href;
    }

  }, [theme]);
}