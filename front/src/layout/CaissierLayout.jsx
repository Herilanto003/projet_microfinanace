import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router";
import { Navigate } from "react-router";

export default function CaissierLayout({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  switch (JSON.parse(user)?.role) {
    case "admin":
      return <Navigate to="/compte/admin/" replace />;
    case "client":
      return <Navigate to="/compte/client/" replace />;
    default:
      return (
        <div>
          {children} <Outlet />
        </div>
      );
  }
}






