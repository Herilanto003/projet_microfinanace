import React from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import Header from "../components/common/Header";
import SideBar from "../components/common/SideBar";
import {
  Home,
  Users,
  CreditCard,
  DollarSign,
  Repeat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menus = [
  { name: "Dashboard", to: "/compte/admin/dashboard", icon: Home },
  { name: "Utilisateurs", to: "/compte/admin/users", icon: Users },
  { name: "Clients", to: "/compte/admin/clients", icon: Users },
  { name: "Comptes", to: "/compte/admin/comptes", icon: DollarSign },
  { name: "Transactions", to: "/compte/admin/transactions", icon: CreditCard },
  { name: "Prets", to: "/compte/admin/prets", icon: DollarSign },
  // { name: "Rembourssement", to: "/compte/admin/remboursements", icon: Repeat },
];

export default function AdminLayout({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  switch (user?.role) {
    case "caissier":
      return <Navigate to="/compte/caissier/" replace />;
    case "client":
      return <Navigate to="/compte/client/" replace />;
    default:
      return (
        <div className="flex h-screen dark:bg-gray-900">
          {/* --- MENU --- */}
          <SideBar menus={menus} />

          <div className="flex flex-col flex-1">
            {/* --- HEADER --- */}
            <Header />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 overflow-y-auto p-4">
              {children}
              <Outlet />
            </main>
          </div>
        </div>
      );
  }
}
