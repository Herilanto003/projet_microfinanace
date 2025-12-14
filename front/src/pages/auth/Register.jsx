import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegisterMutation } from "../../redux/api/authApi";
import { useNavigate, Link } from "react-router";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaCheckCircle,
} from "react-icons/fa";
import ThemeToggle from "../../components/ThemeToggle";

// Schéma de validation avec Zod
const registerSchema = z
  .object({
    name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["password_confirmation"],
  });

export default function Register() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setApiError("");
      setSuccessMessage("");
      const response = await register(data).unwrap();
      setSuccessMessage("Inscription réussie ! Redirection...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setApiError(
        error?.data?.message || "Une erreur est survenue lors de l'inscription"
      );
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
                {/* Illustration SVG - Personne avec ordinateur */}
                <circle cx="250" cy="250" r="200" fill="#EEF2FF" />
                <circle cx="250" cy="250" r="180" fill="#E0E7FF" />

                {/* Ordinateur */}
                <rect
                  x="150"
                  y="200"
                  width="200"
                  height="140"
                  rx="10"
                  fill="#3b82f6"
                />
                <rect
                  x="160"
                  y="210"
                  width="180"
                  height="100"
                  rx="5"
                  fill="#3b82f6"
                />
                <rect
                  x="170"
                  y="220"
                  width="160"
                  height="80"
                  rx="3"
                  fill="#60a5fa"
                />

                {/* Personne */}
                <circle cx="250" cy="150" r="40" fill="#3b82f6" />
                <path
                  d="M250 190 L250 280 M250 220 L210 250 M250 220 L290 250"
                  stroke="#3b82f6"
                  strokeWidth="12"
                  strokeLinecap="round"
                />

                {/* Icônes flottantes */}
                <circle cx="100" cy="150" r="20" fill="#60a5fa" opacity="0.6" />
                <circle cx="400" cy="200" r="25" fill="#60a5fa" opacity="0.6" />
                <circle cx="120" cy="350" r="15" fill="#A78BFA" opacity="0.6" />
                <circle cx="380" cy="320" r="18" fill="#C084FC" opacity="0.6" />
              </svg>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-600 dark:from-blue-400 dark:to-blue-400">
              Rejoignez-nous !
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              Créez votre compte et accédez à tous nos services de microfinance
            </p>
          </div>
        </div>

        {/* Section Formulaire */}
        <div className="w-full">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700">
            {/* En-tête */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                <FaUserPlus className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Créer un compte
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Remplissez le formulaire pour commencer
              </p>
            </div>

            {/* Messages */}
            {apiError && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400 text-sm">
                {apiError}
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                <FaCheckCircle />
                {successMessage}
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...registerField("name")}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="Entrez votre nom complet"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                    {...registerField("email")}
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
                    {...registerField("password")}
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

              {/* Confirmation mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...registerField("password_confirmation")}
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

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
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <FaUserPlus />
                    S'inscrire
                  </>
                )}
              </button>
            </form>

            {/* Lien vers Login */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Vous avez déjà un compte ?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






