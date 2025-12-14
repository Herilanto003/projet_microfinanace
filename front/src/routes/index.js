import { createBrowserRouter } from "react-router";
import Home from "../pages/Home";
import BaseLayout from "../layout/BaseLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../layout/AdminLayout";
import CaissierLayout from "../layout/CaissierLayout";
import ClientLayout from "../layout/ClientLayout";
import DashboardCaissier from "../pages/caissier/DashboardCaissier";
import DashboardClient from "../pages/client/DashboardClient";
import ProtectedRouteAuthenticated from "./ProtectedRouteAuthenticated";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import GuestRoute from "./GuestRoute";
import UserPage from "../pages/admin/UserPage";
import TransactionPage from "../pages/common/TransactionPage";
import RemboursementPage from "../pages/common/RemboursementPage";
import PretPage from "../pages/common/PretPage";
import ClientPage from "../pages/common/ClientPage";
import ComptePage from "../pages/common/ComptePage";
import ClientDetailPage from "../pages/common/ClientDetailPage";
import ClientAddPage from "../pages/common/ClientAddPage";
import ClientEditPage from "../pages/common/ClientEditPage";
import CompteAddPage from "../pages/common/CompteAddPage";
import CompteEditPage from "../pages/common/CompteEditPage";
import CompteDisplayPage from "../pages/common/CompteDispalyPage";
import TransactionDisplayPage from "../pages/common/TransactionDisplayPage";
import TransactionAddPage from "../pages/common/TransactionAddPage";
import PretAddPage from "../pages/common/PretAddPage";
import PretEditPage from "../pages/common/PretEditPage";
import PretDisplayPage from "../pages/common/PretDisplayPage";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, Component: Home },
      // -------- LOGIN AND REGISTER ROUTES -------------
      {
        path: "auth",
        Component: GuestRoute,
        children: [
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },

      // -------- ALL ROUTES NEED TO AUTHENTICATED ------------
      {
        path: "compte",
        Component: ProtectedRouteAuthenticated,
        children: [
          {
            path: "admin",
            Component: AdminLayout,
            children: [
              { path: "", Component: AdminDashboard },
              { path: "dashboard", Component: AdminDashboard },
              { path: "users", Component: UserPage },
              { path: "transactions", Component: TransactionPage },
              { path: "transactions/add", Component: TransactionAddPage },
              { path: "transactions/:id", Component: TransactionDisplayPage },
              { path: "remboursements", Component: RemboursementPage },
              { path: "prets", Component: PretPage },
              { path: "prets/add", Component: PretAddPage },
              { path: "prets/edit/:id", Component: PretEditPage },
              { path: "prets/:id", Component: PretDisplayPage },
              { path: "clients", Component: ClientPage },
              { path: "clients/:id", Component: ClientDetailPage },
              { path: "clients/edit/:id", Component: ClientEditPage },
              { path: "clients/add", Component: ClientAddPage },
              { path: "comptes", Component: ComptePage },
              { path: "comptes/add", Component: CompteAddPage },
              { path: "comptes/edit/:id", Component: CompteEditPage },
              { path: "comptes/:id", Component: CompteDisplayPage },
            ],
          },
          {
            path: "caissier",
            Component: CaissierLayout,
            children: [
              { path: "", Component: DashboardCaissier },
              { path: "dashboard", Component: DashboardCaissier },
            ],
          },
          {
            path: "client",
            Component: ClientLayout,
            children: [
              { path: "", Component: DashboardClient },
              { path: "dashboard", Component: DashboardClient },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
