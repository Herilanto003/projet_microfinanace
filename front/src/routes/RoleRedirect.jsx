import { Navigate } from "react-router";
import { useSelector } from "react-redux";

export default function RoleRedirect() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  switch (JSON.parse(user)?.role) {
    case "admin":
      return <Navigate to="/compte/admin/" replace />;
    case "caissier":
      return <Navigate to="/compte/caissier/" replace />;
    case "client":
      return <Navigate to="/compte/client/" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}






