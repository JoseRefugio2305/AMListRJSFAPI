import { lazy, Suspense } from "react";
import "./App.css";

import { Header } from "./components/Layout/Header.tsx";
import { Route, Routes } from "react-router";
import { Footer } from "./components/Layout/Footer.tsx";
import { ToastNotif } from "./components/Layout/ToastNotif.tsx";
import { usePrimeReactTheme } from "./hooks/usePrimeReactTheme.ts";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute.tsx";
import { AdminProtectedRoute } from "./components/Auth/AdminProtectedRoute.tsx";
import { ScrollTop } from "./components/Layout/ScrollTop.tsx";
const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.tsx"));
const AnimePage = lazy(() => import("./pages/AnimePage.tsx"));
const AnimeDetailsPage = lazy(() => import("./pages/AnimeDetailsPage.tsx"));
const MangaPage = lazy(() => import("./pages/MangaPage.tsx"));
const MangaDetailsPage = lazy(() => import("./pages/MangaDetailsPage.tsx"));
const ExplorePage = lazy(() => import("./pages/Explore/ExplorePage.tsx"));
const ExploreAnimesPage = lazy(
   () => import("./pages/Explore/ExploreAnimesPage.tsx")
);
const ExploreMangasPage = lazy(
   () => import("./pages/Explore/ExploreMangasPage.tsx")
);
const Profile = lazy(() => import("./pages/User/Profile.tsx"));
const ConfigProfilePage = lazy(
   () => import("./pages/User/ConfigProfilePage.tsx")
);
const UserStatsPage = lazy(() => import("./pages/User/UserStatsPage.tsx"));
const UserAnimeListPage = lazy(
   () => import("./pages/User/UserAnimeListPage.tsx")
);
const UserMangaListPage = lazy(
   () => import("./pages/User/UserMangaListPage.tsx")
);
const DashboardStatsPage = lazy(
   () => import("./pages/Dashboard/DashboardStatsPage.tsx")
);
const DashboardGenresListPage = lazy(
   () => import("./pages/Dashboard/DashboardGenresListPage.tsx")
);
const DashboardAnimeListPage = lazy(
   () => import("./pages/Dashboard/DashboardAnimeListPage.tsx")
);
const DashboardStudiosListPage = lazy(
   () => import("./pages/Dashboard/DashboardStudiosListPage.tsx")
);
const DashboardMangaListPage = lazy(
   () => import("./pages/Dashboard/DashboardMangaListPage.tsx")
);
const NotFoundPage = lazy(() => import("./pages/404.tsx"));

function App() {
   usePrimeReactTheme();
   return (
      <>
         <Header />
         <ScrollTop />
         <Suspense
            fallback={
               <div
                  style={{
                     maxWidth: "1280px",
                     margin: "0 auto",
                     padding: "0 1rem",
                  }}
               >
                  Cargando...
               </div>
            }
         >
            <Routes>
               <Route path="/" element={<HomePage />} />
               <Route path="/login" element={<AuthPage />} />
               <Route path="/anime" element={<AnimePage />} />
               <Route
                  path="/anime/:titulo/:key_anime"
                  element={<AnimeDetailsPage />}
               />
               <Route path="/manga" element={<MangaPage />} />
               <Route
                  path="/manga/:titulo/:key_manga"
                  element={<MangaDetailsPage />}
               />
               <Route path="/explore" element={<ExplorePage />} />
               <Route path="/explore/animes" element={<ExploreAnimesPage />} />
               <Route path="/explore/mangas" element={<ExploreMangasPage />} />
               <Route path="/user/:name/lists" element={<Profile />} />
               <Route
                  path="/user/config"
                  element={
                     <ProtectedRoute redirectTo="/login">
                        <ConfigProfilePage />
                     </ProtectedRoute>
                  }
               />
               <Route path="/user/:name/stats" element={<UserStatsPage />} />
               <Route
                  path="/user/:name/animelist"
                  element={<UserAnimeListPage />}
               />

               <Route
                  path="/user/:name/mangalist"
                  element={<UserMangaListPage />}
               />
               <Route
                  path="/dashboard"
                  element={
                     <AdminProtectedRoute redirectTo="/">
                        <DashboardStatsPage />
                     </AdminProtectedRoute>
                  }
               />
               <Route
                  path="/dashboard/genreslist"
                  element={
                     <AdminProtectedRoute redirectTo="/">
                        <DashboardGenresListPage />
                     </AdminProtectedRoute>
                  }
               />
               <Route
                  path="/dashboard/animelist"
                  element={
                     <AdminProtectedRoute redirectTo="/">
                        <DashboardAnimeListPage />
                     </AdminProtectedRoute>
                  }
               />
               <Route
                  path="/dashboard/studioslist"
                  element={
                     <AdminProtectedRoute redirectTo="/">
                        <DashboardStudiosListPage />
                     </AdminProtectedRoute>
                  }
               />
               <Route
                  path="/dashboard/mangalist"
                  element={
                     <AdminProtectedRoute redirectTo="/">
                        <DashboardMangaListPage />
                     </AdminProtectedRoute>
                  }
               />
               <Route path="*" element={<NotFoundPage />} />
            </Routes>
         </Suspense>
         <ToastNotif />
         <Footer />
      </>
   );
}

export default App;
