import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeftIcon,
  UserPenIcon,
  UserIcon,
  IdCardIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import {
  useGetClientByIdQuery,
  useUpdateClientMutation,
} from "../../redux/api/clientApi";
import { toast } from "react-toastify";

// Schema de validation avec Zod
const clientSchema = z.object({
  nom_client: z.string().min(1, "Le nom est requis"),
  prenom_client: z.string().min(1, "Le prénom est requis"),
  cin_client: z.string().min(1, "Le CIN est requis"),
  telephone_client: z
    .string()
    .min(10, "Le téléphone doit contenir au moins 10 caractères"),
  email_client: z.string().email("Format d'email invalide"),
  adresse_client: z.string().min(1, "L'adresse est requise"),
});

export default function ClientEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [updateClient, { isLoading: isLoadingUpdateClient, isSuccess }] =
    useUpdateClientMutation();

  const {
    data: clientData,
    isLoading,
    isError,
    error,
  } = useGetClientByIdQuery(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(clientSchema),
  });

  // Reset form when data is loaded
  useEffect(() => {
    if (clientData?.data) {
      reset({
        nom_client: clientData.data.nom_client || "",
        prenom_client: clientData.data.prenom_client || "",
        cin_client: clientData.data.cin_client || "",
        telephone_client: clientData.data.telephone_client || "",
        email_client: clientData.data.email_client || "",
        adresse_client: clientData.data.adresse_client || "",
      });
    }
  }, [clientData, reset]);

  const onSubmit = async (data) => {
    try {
      console.log("Données du formulaire:", data);

      const response = await updateClient({ id, ...data });

      if (response?.data?.success) {
        toast.success("Modification client avec succès !", {
          theme: "colored",
        });
        navigate("/compte/admin/clients");
      } else {
        toast.error("Erreur de modification !", { theme: "colored" });
      }

      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Erreur de modification !", { theme: "colored" });
    }
  };

  const handleBack = () => {
    navigate("/compte/admin/clients");
  };

  // Design amélioré pour le chargement
  if (isLoading) {
    return (
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-900/20"
          >
            <ArrowLeftIcon size={20} />
            <span className="font-medium">Retour</span>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <UserPenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Modification client
          </h1>
        </div>

        {/* Squelette de chargement stylisé */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index}>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse"></div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    </div>
                    <div className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse h-12"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Boutons de chargement */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="w-24 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="w-40 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-900/20"
          >
            <ArrowLeftIcon size={20} />
            <span className="font-medium">Retour</span>
          </button>
        </div>

        <div className="bg-gray-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center">
          <div className="text-blue-500 dark:text-blue-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-blue-600 dark:text-blue-400 mb-4">
            Impossible de charger les données du client. Veuillez réessayer.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      {/* En-tête avec bouton de retour */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-blue-900/20"
        >
          <ArrowLeftIcon size={20} />
          <span className="font-medium">Retour</span>
        </button>
      </div>

      {/* Titre avec icône */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <UserPenIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Modification client
        </h1>
      </div>

      {/* Formulaire */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label
                htmlFor="nom_client"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nom *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("nom_client")}
                  type="text"
                  id="nom_client"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.nom_client
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Entrez le nom"
                />
              </div>
              {errors.nom_client && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.nom_client.message}
                </p>
              )}
            </div>

            {/* Prénom */}
            <div>
              <label
                htmlFor="prenom_client"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Prénom *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("prenom_client")}
                  type="text"
                  id="prenom_client"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.prenom_client
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Entrez le prénom"
                />
              </div>
              {errors.prenom_client && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.prenom_client.message}
                </p>
              )}
            </div>

            {/* CIN */}
            <div>
              <label
                htmlFor="cin_client"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                CIN *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IdCardIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("cin_client")}
                  type="text"
                  id="cin_client"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.cin_client
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Entrez le CIN"
                />
              </div>
              {errors.cin_client && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.cin_client.message}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label
                htmlFor="telephone_client"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Téléphone *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("telephone_client")}
                  type="tel"
                  id="telephone_client"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.telephone_client
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Entrez le téléphone"
                />
              </div>
              {errors.telephone_client && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.telephone_client.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label
                htmlFor="email_client"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("email_client")}
                  type="email"
                  id="email_client"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.email_client
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Entrez l'email"
                />
              </div>
              {errors.email_client && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.email_client.message}
                </p>
              )}
            </div>

            {/* Adresse */}
            <div className="md:col-span-2">
              <label
                htmlFor="adresse_client"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Adresse *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <MapPinIcon className="h-5 w-5 text-blue-500" />
                </div>
                <textarea
                  {...register("adresse_client")}
                  id="adresse_client"
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.adresse_client
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none`}
                  placeholder="Entrez l'adresse complète"
                />
              </div>
              {errors.adresse_client && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.adresse_client.message}
                </p>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              <ArrowLeftIcon size={18} />
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoadingUpdateClient}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {isLoadingUpdateClient ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Modification...
                </>
              ) : (
                <>
                  <UserPenIcon size={18} />
                  Modifier le client
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}






