import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

export default function GuestRoute({ children }) {
  const { token, user } = useSelector((state) => state.auth);

  // Si l'utilisateur est connecté, rediriger vers son dashboard
  if (token) {
    const role = !user ? JSON.parse(user)?.role : null;

    if (role === "admin") {
      return <Navigate to="/compte/admin/dashboard" replace />;
    } else if (role === "caissier") {
      return <Navigate to="/compte/caissier/dashboard" replace />;
    } else if (role === "client") {
      return <Navigate to="/compte/client/dashboard" replace />;
    }

    // Par défaut, rediriger vers la page d'accueil
    return <Navigate to="/" replace />;
  }

  // Si non connecté, afficher la page (login ou register)
  return (
    <>
      {children} <Outlet />
    </>
  );
}






