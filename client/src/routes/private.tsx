import { AuthProvider } from "@/contexts/auth-provider";
import { Navigate, Outlet } from "react-router-dom";

export function Private() {
  const token = localStorage.getItem("session-ntangu");
  return (
    <div>
      {token ? (
        <AuthProvider>
          <Outlet />
        </AuthProvider>
      ) : (
        <Navigate to={"/login"} />
      )}
    </div>
  );
}
