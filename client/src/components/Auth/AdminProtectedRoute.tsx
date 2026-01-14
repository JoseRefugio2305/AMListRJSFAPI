import type { ReactNode } from "react";
import { authStore } from "../../store/authStore";
import { Navigate } from "react-router";

interface AdminProtectedRouteProps {
   children: ReactNode;
   redirectTo: string;
}
export function AdminProtectedRoute({
   children,
   redirectTo = "/login",
}: AdminProtectedRouteProps) {
   const { username, rol } = authStore();
   if (!username || rol !== 1) {
      return <Navigate to={redirectTo} replace />;
   }
   return children;
}
