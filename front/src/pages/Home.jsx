// import React from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router";
// import { logout } from "../redux/features/authSlice";
// import ThemeToggle from "../components/ThemeToggle";

// export default function Home() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { isAuthenticated, user } = useSelector((state) => state.auth);

//   // Redirection dashboard selon le rôle
//   const handleDashboard = () => {
//     if (!user || !user.role) return navigate("/");
//     if (user.role === "admin") navigate("/compte/admin/dashboard");
//     else if (user.role === "caissier") navigate("/compte/caissier/dashboard");
//     else if (user.role === "client") navigate("/compte/client/dashboard");
//     else navigate("/compte/admin");
//   };

//   // Déconnexion
//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };

//   // Aller à la page de connexion
//   const handleLogin = () => {
//     navigate("/auth/login");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-blue-900 flex items-center justify-center p-4 relative">
//       {/* Bouton Theme Toggle */}
//       <div className="absolute top-4 right-4 z-10">
//         <ThemeToggle />
//       </div>

//       <div className="w-full max-w-xl mx-auto bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-8">
//         <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600 dark:from-blue-400 dark:to-blue-400 mb-2 text-center">
//           Bienvenue sur Microfinance
//         </h1>
//         <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-6">
//           Gérez vos comptes, transactions et prêts en toute sécurité.
//         </p>

//         {isAuthenticated ? (
//           <div className="flex flex-col gap-4 w-full items-center">
//             <button
//               onClick={handleDashboard}
//               className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
//             >
//               Accéder au dashboard
//             </button>
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl"
//               title="Se déconnecter"
//             >
//               Déconnexion
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={handleLogin}
//             className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
//           >
//             Se connecter
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../redux/features/authSlice";
import ThemeToggle from "../components/ThemeToggle";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirection dashboard selon le rôle
  const handleDashboard = () => {
    if (!user || !user.role) return navigate("/");
    if (user.role === "admin") navigate("/compte/admin/dashboard");
    else if (user.role === "caissier") navigate("/compte/caissier/dashboard");
    else if (user.role === "client") navigate("/compte/client/dashboard");
    else navigate("/compte/admin");
  };

  // Déconnexion
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Aller à la page de connexion
  const handleLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Éléments d'arrière-plan animés */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 dark:bg-red-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-200 dark:bg-green-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-red-300 dark:bg-red-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Bouton Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl mx-auto relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:border-red-900/30 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
          {/* Header */}
          <div className=" p-1">
            <div className="bg-white dark:bg-gray-800 rounded-t-3xl p-8">
              <div className="text-center space-y-4">
                {/* Logo animé */}
                <div className="flex justify-center">
                  <img className="w-50" src="logo.png" alt="" />
                </div>

                <h1 className="text-5xl font-bold text-red-600 dark:text-red-400">
                  Microfinance
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                  Gérez vos comptes, transactions et prêts en toute sécurité
                </p>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="p-8 space-y-6">
            {isAuthenticated ? (
              <div className="space-y-4">
                {/* Message de bienvenue personnalisé */}
                <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl p-6 border border-green-200 dark:border-green-900/30">
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Bonjour,{" "}
                    <span className="text-green-600 dark:text-green-400">
                      {user?.name || "Utilisateur"}
                    </span>{" "}
                    👋
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Rôle:{" "}
                    <span className="font-medium capitalize text-red-600 dark:text-red-400">
                      {user?.role}
                    </span>
                  </p>
                </div>

                {/* Bouton Dashboard */}
                <button
                  onClick={handleDashboard}
                  className="group w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <svg
                    className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <span className="relative">Accéder au Dashboard</span>
                </button>

                {/* Bouton Déconnexion */}
                <button
                  onClick={handleLogout}
                  className="group w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Features cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900/30 transform hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-2">🔒</div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Sécurisé
                    </p>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/30 transform hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-2">⚡</div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Rapide
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900/30 transform hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl mb-2">📊</div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Fiable
                    </p>
                  </div>
                </div>

                {/* Bouton Connexion */}
                <button
                  onClick={handleLogin}
                  className="group w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <svg
                    className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="relative z-10 text-lg">Se connecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
