import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { Navigate } from "react-router";

export default function ClientLayout({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  switch (JSON.parse(user)?.role) {
    case "caissier":
      return <Navigate to="/compte/caissier/" replace />;
    case "admin":
      return <Navigate to="/compte/admin/" replace />;
    default:
      return (
        <div>
          {children} <Outlet />
        </div>
      );
  }
}






