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
import { PageSkeleton } from "./components/Skeletons/PageSkeleton.tsx";
const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const AuthPage = lazy(() => import("./pages/AuthPage.tsx"));
const AnimePage = lazy(
   () => import(/* webpackChunkName: "anime" */ "./pages/Anime/AnimePage.tsx"),
);
const AnimeDetailsPage = lazy(
   () =>
      import(
         /* webpackChunkName: "anime" */
         "./pages/Anime/AnimeDetailsPage.tsx"
      ),
);
const MangaPage = lazy(
   () => import(/* webpackChunkName: "manga" */ "./pages/Manga/MangaPage.tsx"),
);
const MangaDetailsPage = lazy(
   () =>
      import(
         /* webpackChunkName: "manga" */
         "./pages/Manga/MangaDetailsPage.tsx"
      ),
);
const ExplorePage = lazy(
   () =>
      import(
         /* webpackChunkName: "explore" */ "./pages/Explore/ExplorePage.tsx"
      ),
);
const ExploreAnimesPage = lazy(
   () =>
      import(
         /* webpackChunkName: "explore" */ "./pages/Explore/ExploreAnimesPage.tsx"
      ),
);
const ExploreMangasPage = lazy(
   () =>
      import(
         /* webpackChunkName: "explore" */ "./pages/Explore/ExploreMangasPage.tsx"
      ),
);
const Profile = lazy(
   () =>
      import(
         /* webpackChunkName: "user-prof-conf" */ "./pages/User/Profile.tsx"
      ),
);
const ConfigProfilePage = lazy(
   () =>
      import(
         /* webpackChunkName: "user-prof-conf" */ "./pages/User/ConfigProfilePage.tsx"
      ),
);
const UserStatsPage = lazy(
   () =>
      import(
         /* webpackChunkName: "user-lists" */ "./pages/User/UserStatsPage.tsx"
      ),
);
const UserAnimeListPage = lazy(
   () =>
      import(
         /* webpackChunkName: "user-lists" */ "./pages/User/UserAnimeListPage.tsx"
      ),
);
const UserMangaListPage = lazy(
   () =>
      import(
         /* webpackChunkName: "user-lists" */ "./pages/User/UserMangaListPage.tsx"
      ),
);
const DashboardStatsPage = lazy(
   () =>
      import(
         /* webpackChunkName: "dashboard-gen" */ "./pages/Dashboard/DashboardStatsPage.tsx"
      ),
);
const DashboardGenresListPage = lazy(
   () =>
      import(
         /* webpackChunkName: "dashboard-gen" */ "./pages/Dashboard/DashboardGenresListPage.tsx"
      ),
);
const DashboardAnimeListPage = lazy(
   () =>
      import(
         /* webpackChunkName: "dashboard-anime" */ "./pages/Dashboard/DashboardAnimeListPage.tsx"
      ),
);
const AnimeEditPage = lazy(
   () =>
      import(
         /* webpackChunkName: "dashboard-anime" */ "./pages/Anime/AnimeEditPage.tsx"
      ),
);
const DashboardStudiosListPage = lazy(
   () =>
      import(
         /* webpackChunkName: "dashboard-anime-studios" */ "./pages/Dashboard/DashboardStudiosListPage.tsx"
      ),
);
const DashboardMangaListPage = lazy(
   () =>
      import(
         /* webpackChunkName: "dashboard-manga" */ "./pages/Dashboard/DashboardMangaListPage.tsx"
      ),
);
const MangaEditPage = lazy(
   () =>
      import(
         /* webpackChunkName: "dashboard-manga" */ "./pages/Manga/MangaEditPage.tsx"
      ),
);
const DashboardEditorialsListPage = lazy(
   () =>
      import(
         /* webpackChunkName: "dashboard-manga-edtauth" */ "./pages/Dashboard/DashboardEditorialsListPage.tsx"
      ),
);
const DashboardAutoresListPage = lazy(
   () =>
      import(
         /* webpackChunkName: "dashboard-manga-edtauth" */ "./pages/Dashboard/DashboardAutoresListPage.tsx"
      ),
);
const NotFoundPage = lazy(() => import("./pages/404.tsx"));

function App() {
   usePrimeReactTheme();
   return (
      <>
         <Header />
         <ScrollTop />
         <Suspense fallback={<PageSkeleton />}>
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
               />{" "}
               <Route
                  path="/dashboard/editorialslist"
                  element={
                     <AdminProtectedRoute redirectTo="/">
                        <DashboardEditorialsListPage />
                     </AdminProtectedRoute>
                  }
               />
               <Route
                  path="/dashboard/authorslist"
                  element={
                     <AdminProtectedRoute redirectTo="/">
                        <DashboardAutoresListPage />
                     </AdminProtectedRoute>
                  }
               />
               <Route
                  path="/anime/:key_anime/edit"
                  element={
                     <AdminProtectedRoute redirectTo="/">
                        <AnimeEditPage />
                     </AdminProtectedRoute>
                  }
               />
               <Route
                  path="/manga/:key_manga/edit"
                  element={
                     <AdminProtectedRoute redirectTo="/">
                        <MangaEditPage />
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
