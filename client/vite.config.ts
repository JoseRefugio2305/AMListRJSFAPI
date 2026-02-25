import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          //Chunks de paginas
          "anime": ["./src/pages/Anime/AnimePage.tsx",
            "./src/pages/Anime/AnimeDetailsPage.tsx"],
          "manga": ["./src/pages/Manga/MangaPage.tsx",
            "./src/pages/Manga/MangaDetailsPage.tsx"],
          "explore": ["./src/pages/Explore/ExplorePage.tsx",
            "./src/pages/Explore/ExploreAnimesPage.tsx",
            "./src/pages/Explore/ExploreMangasPage.tsx"],
          "user-prof-conf": ["./src/pages/User/Profile.tsx",
            "./src/pages/User/ConfigProfilePage.tsx"],
          "user-lists": ["./src/pages/User/UserStatsPage.tsx",
            "./src/pages/User/UserAnimeListPage.tsx",
            "./src/pages/User/UserMangaListPage.tsx"],
          "dashboard-gen": ["./src/pages/Dashboard/DashboardStatsPage.tsx",
            "./src/pages/Dashboard/DashboardGenresListPage.tsx"],
          "dashboard-anime": ["./src/pages/Dashboard/DashboardAnimeListPage.tsx",
            "./src/pages/Anime/AnimeEditPage.tsx"],
          "dashboard-manga": ["./src/pages/Dashboard/DashboardMangaListPage.tsx",
            "./src/pages/Manga/MangaEditPage.tsx"],
          "dashboard-anime-studios": ["./src/pages/Dashboard/DashboardStudiosListPage.tsx"], "dashboard-manga-edtauth": ["./src/pages/Dashboard/DashboardAutoresListPage.tsx",
            "./src/pages/Dashboard/DashboardEditorialsListPage.tsx"],
        }
      }
    }
  }
})