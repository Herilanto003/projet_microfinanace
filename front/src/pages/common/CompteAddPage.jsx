import {
  ArrowLeftIcon,
  UserPenIcon,
  UserIcon,
  IdCardIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  PlusIcon,
  BuildingIcon,
  FileTextIcon,
  LandmarkIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useCreateCompteMutation } from "../../redux/api/compteApi";
import { useGetClientsQuery } from "../../redux/api/clientApi"; // Import pour récupérer les clients
import { toast } from "react-toastify";

// Schema de validation avec Zod
const compteSchema = z.object({
  nom_compte: z.string().min(1, "Le nom du compte est requis"),
  description_compte: z.string().optional(),
  solde_compte: z
    .string()
    .min(1, "Le solde est requis")
    .regex(/^\d+(\.\d{1,2})?$/, "Le solde doit être un nombre valide"),
  client_id: z.string().min(1, "Le client est requis"),
});

export default function CompteAddPage() {
  const navigate = useNavigate();
  const [createCompte, { isLoading: isCreating }] = useCreateCompteMutation();

  // Récupération de la liste des clients
  const {
    data: clientsData,
    isLoading: isLoadingClients,
    error: clientsError,
  } = useGetClientsQuery();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(compteSchema),
    defaultValues: {
      statut_compte: "Active",
      solde_compte: "0.00",
    },
  });

  // Effet pour gérer les erreurs de chargement des clients
  useEffect(() => {
    if (clientsError) {
      toast.error("Erreur lors du chargement des clients");
      console.error("Erreur clients:", clientsError);
    }
  }, [clientsError]);

  const onSubmit = async (data) => {
    try {
      // Conversion du solde en number si nécessaire (selon l'API)
      const compteData = {
        ...data,
        solde_compte: parseFloat(data.solde_compte).toFixed(2),
        tag: false,
      };

      await createCompte(compteData).unwrap();
      toast.success("Compte ajouté avec succès !");
      reset();
      navigate("/compte/admin/comptes");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout du compte");
    }
  };

  const handleBack = () => {
    navigate("/compte/admin/comptes");
  };

  const handleReset = () => {
    reset({
      statut_compte: "Active",
      solde_compte: "0.00",
    });
  };

  // Formatage de l'affichage des clients pour la liste déroulante
  const formatClientDisplay = (client) => {
    return `${client.id} - ${client.prenom_client} ${client.nom_client}`;
  };

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
          <LandmarkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Ajouter un compte
        </h1>
      </div>

      {/* Formulaire */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom du compte */}
            <div className="md:col-span-2">
              <label
                htmlFor="nom_compte"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nom du compte *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("nom_compte")}
                  type="text"
                  id="nom_compte"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.nom_compte
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Ex: Compte Courant Principal"
                />
              </div>
              {errors.nom_compte && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.nom_compte.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description_compte"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileTextIcon className="h-5 w-5 text-blue-500" />
                </div>
                <textarea
                  {...register("description_compte")}
                  id="description_compte"
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.description_compte
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none`}
                  placeholder="Description du compte (optionnel)"
                />
              </div>
              {errors.description_compte && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.description_compte.message}
                </p>
              )}
            </div>

            {/* Solde */}
            <div>
              <label
                htmlFor="solde_compte"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Solde initial *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LandmarkIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("solde_compte")}
                  type="text"
                  id="solde_compte"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.solde_compte
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="0.00"
                />
              </div>
              {errors.solde_compte && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.solde_compte.message}
                </p>
              )}
            </div>

            {/* Client - Liste déroulante */}
            <div className="md:col-span-2">
              <label
                htmlFor="client_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Client *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-blue-500" />
                </div>
                <select
                  {...register("client_id")}
                  id="client_id"
                  disabled={isLoadingClients}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                    errors.client_id
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:dark:bg-gray-600`}
                >
                  <option value="">Sélectionnez un client</option>
                  {clientsData?.data?.map((client) => (
                    <option key={client.id} value={client.id}>
                      {formatClientDisplay(client)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {isLoadingClients && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  Chargement des clients...
                </p>
              )}
              {errors.client_id && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.client_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Réinitialiser
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isCreating || isLoadingClients}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {isSubmitting || isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <PlusIcon size={18} />
                  Ajouter le compte
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}






