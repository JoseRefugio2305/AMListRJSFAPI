# Cliente AMList

Desarrollado sobre **[Vite](https://v3.vitejs.dev/guide/)** con **[React](https://es.react.dev/)** y **[TS](https://www.typescriptlang.org/)**.

En el cliente se incluyen secciones como Home, donde se muestra una vista previa del contenido disponible de anime y manga, así como un ranking de los títulos mejor calificados. También cuenta con apartados específicos para Anime y Manga, herramientas de exploración de contenido, y la posibilidad de consultar las listas de anime y manga favoritos desde el perfil del usuario, así como visitar los perfiles de otros usuarios.

Además, el sistema permite la edición del perfil y, cuando el usuario está autenticado como administrador, brinda acceso al Dashboard de administración del sistema.

[Click en las siguientes imágenes para ver un clip de la ejecución del Proyecto en YouTube](https://youtu.be/dPWxWPQ5xxg)

[![Clip del Proyecto](../assets/captura.png)](https://youtu.be/dPWxWPQ5xxg "Clip del Proyecto")

## Estructura del Proyecto

```bash
client/
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   ├── index.css
│   ├── assets/
│   ├── components/
│   │   ├── Anime/
│   │   ├── Auth/
│   │   ├── Charts/
│   │   ├── Common/
│   │   ├── Dashboard/
│   │   ├── Home/
│   │   ├── Layout/
│   │   ├── Manga/
│   │   ├── Search/
│   │   ├── Skeletons/
│   │   └── User/
│   ├── hooks/
│   │   ├── useAxios.ts
│   │   ├── useFilters.ts
│   │   ├── usePrimeReactTheme.ts
│   │   ├── useStatsDashboard.ts
│   │   ├── useStatsFavs.ts
│   │   └── useSyncSearchParams.ts
│   ├── pages/
│   │   ├── 404.tsx
│   │   ├── AuthPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── Anime/
│   │   ├── Dashboard/
│   │   ├── Explore/
│   │   ├── Manga/
│   │   └── User/
│   ├── schemas/
│   │   ├── animeSchemas.ts
│   │   ├── authSchemas.ts
│   │   ├── favoritesSchema.ts
│   │   ├── filtersSchemas.ts
│   │   ├── gsaeSchema.ts
│   │   ├── mangaSchemas.ts
│   │   ├── relationsSchemas.ts
│   │   ├── searchSchemas.ts
│   │   ├── statsSchemas.ts
│   │   └── userSchemas.ts
│   ├── services/
│   │   ├── animeServices.ts
│   │   ├── authServices.ts
│   │   ├── dashboardAnimeServides.ts
│   │   ├── dashboardMangaServices.ts
│   │   ├── favServices.ts
│   │   ├── mangaServices.ts
│   │   ├── searchServices.ts
│   │   ├── statsServices.ts
│   │   └── userServices.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   └── toastStore.ts
│   ├── types/
│   │   ├── animeTypes.ts
│   │   ├── authTypes.ts
│   │   ├── favoritesTypes.ts
│   │   ├── filterTypes.ts
│   │   ├── mangaTypes.ts
│   │   ├── searchTypes.ts
│   │   ├── statsTypes.ts
│   │   └── userTypes.ts
│   └── utils/
│       ├── common.ts
│       ├── filters.ts
│       ├── parse.ts
│       └── parse_error.ts
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Getting Started

Instrucciones de instalación e inicialización del proyecto.

### Prerrequisitos

- [NodeJS 24+](https://nodejs.org/es)
- [pnpm](https://pnpm.io/es/)

### Instalación

1. **Instalar los paquetes necesarios.**

   Una vez clonado el repositorio dentro del directorio ./client/ ejecutar lo siguiente:

   ```bash
    pnpm install
    # o simplemente
    pnpm i
   ```

2. **Configuración de las variables de entorno.**

   Crea el archivo **_`.env`_** en la ruta /client y agrega las siguientes propiedades.

   ```bash
   VITE_BASE_URL_PAGE= http://localhost:5173/
   VITE_API_BASE_URL_PAGE=http://127.0.0.1:8000
   ```

   Reemplaza el valor de las variables con las que usaras en el proyecto.

## Uso

### Ejecución de la aplicación

Para iniciar la aplicación hay que ejecutar el siguiente comando en la terminal

```bash
pnpm run dev
```

## Tecnologías usadas

- [NodeJS 24+](https://nodejs.org/es)
- [pnpm](https://pnpm.io/es/)
- [Vite](https://v3.vitejs.dev/guide/)
- [React](https://es.react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/docs/installation/using-vite)

## Componentes y recursos

- [PrimeReact](https://primereact.org/installation/)
- [FlowbiteReact](https://flowbite-react.com/docs/getting-started/introduction)
- [Lucide Icons](https://lucide.dev/icons/)
- [ApexCharts React](https://apexcharts.com/react-chart-demos/)
- [Zod](https://zod.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)

## Ejecución con Docker

### Build de la imagen

En la ruta **`./client`** se debe ejecutar el siguiente comando:

```bash
docker build -t client-amlist .
```

### Inicialización de la imagen

En la ruta **`./client`** se debe ejecutar el siguiente comando:

```bash
docker run -p 5173:80 client-amlist
```
