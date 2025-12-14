import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

export default function ProtectedRouteAuthenticated({ children }) {
  const { token, user } = useSelector((state) => state.auth);

  return token != null && user != null ? (
    <>
      {children} <Outlet />
    </>
  ) : (
    <Navigate to={"/auth/login"} />
  );
}






