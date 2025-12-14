import { useState } from "react";
import {
  Home,
  Users,
  CreditCard,
  DollarSign,
  Repeat,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { useSelector } from "react-redux";

export default function SideBar({ menus }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  return (
    <aside
      className={`h-full bg-gray-50 dark:bg-gray-900 shadow-md dark:shadow-black/20 z-40 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Logo / Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-pink-500 dark:from-blue-500 dark:to-purple-700 flex items-center justify-center text-white font-bold">
              MF
            </div>
            {!collapsed && (
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Microfinance
              </div>
            )}
          </div>

          <button
            aria-label={
              collapsed ? "Développer la sidebar" : "Réduire la sidebar"
            }
            onClick={() => setCollapsed((c) => !c)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menus.map((m) => {
            const Icon = m.icon;
            const isActive = location.pathname === m.to;

            return (
              <NavLink
                to={m.to}
                key={m.name}
                className={({ isActive: navActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                    navActive
                      ? "bg-gray-100 text-blue-700 font-medium dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`
                }
                title={collapsed ? m.name : undefined}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`p-2 rounded-md ${
                    isActive
                      ? "bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-300"
                      : "text-gray-500 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400"
                  }`}
                >
                  <Icon size={18} />
                </div>
                {!collapsed && <span className="truncate">{m.name}</span>}
                {/* Tooltip for collapsed state (visual only via title attr) */}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          {!collapsed && (
            <div className="text-xs text-gray-500 dark:text-gray-300">
              Connecté en tant que{" "}
              <span className="text-gray-800 dark:text-gray-100 font-medium capitalize">
                {user?.role}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
