import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLoginMutation } from "../../redux/api/authApi";
import { useNavigate, Link } from "react-router";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/authSlice";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaCheckCircle,
} from "react-icons/fa";
import ThemeToggle from "../../components/ThemeToggle";

// Schéma de validation avec Zod
const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError("");
      const response = await login(data).unwrap();

      // Stocker les credentials dans Redux
      dispatch(
        setCredentials({
          user: response.user,
          token: response.token,
        })
      );

      // Redirection selon le rôle
      const role = response.user?.role;
      if (role === "admin") {
        navigate("/compte/admin/dashboard");
      } else if (role === "caissier") {
        navigate("/compte/caissier/dashboard");
      } else if (role === "client") {
        navigate("/compte/client/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setApiError(error?.data?.message || "Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-blue-900 flex items-center justify-center p-4 relative">
      {/* Bouton Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Section Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl shadow-2xl">
              <svg
                className="w-80 h-80"
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Illustration SVG - Sécurité et connexion */}
                <circle cx="250" cy="250" r="200" fill="#EEF2FF" />
                <circle cx="250" cy="250" r="180" fill="#E0E7FF" />

                {/* Cadenas principal */}
                <rect
                  x="180"
                  y="220"
                  width="140"
                  height="160"
                  rx="20"
                  fill="#3b82f6"
                />
                <rect
                  x="190"
                  y="230"
                  width="120"
                  height="140"
                  rx="15"
                  fill="#3b82f6"
                />

                {/* Arc du cadenas */}
                <path
                  d="M 200 220 Q 200 150, 250 150 Q 300 150, 300 220"
                  stroke="#3b82f6"
                  strokeWidth="20"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Trou de serrure */}
                <circle cx="250" cy="300" r="20" fill="#60a5fa" />
                <rect
                  x="240"
                  y="300"
                  width="20"
                  height="40"
                  rx="5"
                  fill="#60a5fa"
                />

                {/* Étoiles de sécurité */}
                <circle cx="120" cy="180" r="15" fill="#60a5fa" opacity="0.7">
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="380" cy="200" r="20" fill="#60a5fa" opacity="0.7">
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="100" cy="320" r="12" fill="#A78BFA" opacity="0.7">
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="390" cy="340" r="18" fill="#C084FC" opacity="0.7">
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Checkmark de sécurité */}
                <path
                  d="M 230 100 L 245 115 L 275 85"
                  stroke="#10B981"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600 dark:from-blue-400 dark:to-blue-400">
              Bon retour !
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Connectez-vous pour accéder à votre espace sécurisé
            </p>
          </div>
        </div>

        {/* Section Formulaire */}
        <div className="w-full">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700">
            {/* En-tête */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                <FaSignInAlt className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Connexion
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Accédez à votre compte
              </p>
            </div>

            {/* Message d'erreur */}
            {apiError && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400 text-sm">
                {apiError}
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="exemple@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Options supplémentaires */}
              {/* <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Se souvenir de moi
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
                >
                  Mot de passe oublié ?
                </a>
              </div> */}

              {/* Bouton Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Se connecter
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
