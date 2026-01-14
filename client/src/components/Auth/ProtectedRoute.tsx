import type { ReactNode } from "react";
import { authStore } from "../../store/authStore";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
   children: ReactNode;
   redirectTo: string;
}
export function ProtectedRoute({
   children,
   redirectTo = "/login",
}: ProtectedRouteProps) {
   const { username } = authStore();
   if (!username) {
      return <Navigate to={redirectTo} replace />;
   }
   return children;
}
