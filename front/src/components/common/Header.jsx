import { useState, useEffect } from "react";
import { Sun, Moon, LogOut } from "lucide-react";
import { useSelector } from "react-redux";

export default function Header() {
  const { title } = useSelector((state) => state.titleHeader);

  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  const handleLogout = () => {
    // TODO: remplacer par logique réelle de déconnexion (API / clear auth)
    console.log("déconnexion");
  };

  return (
    <header className="bg-gray-50 dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between">
      {/* <div className="flex items-center gap-4">
        <button className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-600 text-white font-medium shadow-sm">
          <span className="font-semibold">Tableau de bord</span>
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Microfinance
        </h1>
      </div> */}
      <div>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Dark / Light toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          aria-pressed={dark}
          className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          title={dark ? "Activer le mode clair" : "Activer le mode sombre"}
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          title="Se déconnecter"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}






