import {
  ArrowLeftIcon,
  HandCoinsIcon,
  FileTextIcon,
  CalendarIcon,
  LandmarkIcon,
  UserIcon,
  ClockIcon,
  PercentIcon,
  PlusIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useCreatePretMutation } from "../../redux/api/pretApi";
import { useGetClientsQuery } from "../../redux/api/clientApi";
import { toast } from "react-toastify";

// Schema de validation avec Zod
const pretSchema = z.object({
  titre_pret: z.string().min(1, "Le titre du prêt est requis"),
  description_pret: z.string().min(1, "La description est requise"),
  statut_pret: z.enum(["EN COURS", "TERMINE", "IMPAYE"], {
    required_error: "Le statut est requis",
  }),
  date_pret: z.string().min(1, "La date du prêt est requise"),
  montant_pret: z
    .string()
    .min(1, "Le montant est requis")
    .regex(/^\d+(\.\d{1,2})?$/, "Le montant doit être un nombre valide"),
  client_id: z.string().min(1, "Le client est requis"),
  periode: z
    .string()
    .min(1, "La période est requise")
    .regex(/^\d+$/, "La période doit être un nombre entier"),
  taux_pret: z
    .string()
    .min(1, "Le taux est requis")
    .regex(/^\d+(\.\d{1,2})?$/, "Le taux doit être un nombre valide"),
  approbation_pret: z.enum(["APPROUVE", "EN_ATTENTE", "REFUSE"], {
    required_error: "L'approbation est requise",
  }),
});

export default function PretAddPage() {
  const navigate = useNavigate();
  const [createPret, { isLoading: isCreating }] = useCreatePretMutation();

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
    resolver: zodResolver(pretSchema),
    defaultValues: {
      statut_pret: "EN COURS",
      approbation_pret: "EN_ATTENTE",
      periode: "12",
      taux_pret: "15.00",
      montant_pret: "0.00",
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
      // Formatage des données pour l'API
      const pretData = {
        ...data,
        montant_pret: parseFloat(data.montant_pret).toFixed(2),
        taux_pret: parseFloat(data.taux_pret).toFixed(2),
        periode: parseInt(data.periode),
        client_id: parseInt(data.client_id),
      };

      await createPret(pretData).unwrap();
      toast.success("Prêt ajouté avec succès !");
      reset();
      navigate("/compte/admin/prets");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout du prêt");
    }
  };

  const handleBack = () => {
    navigate("/compte/admin/prets");
  };

  const handleReset = () => {
    reset({
      statut_pret: "EN COURS",
      approbation_pret: "EN_ATTENTE",
      periode: "12",
      taux_pret: "15.00",
      montant_pret: "0.00",
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
          <HandCoinsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Ajouter un prêt
        </h1>
      </div>

      {/* Formulaire */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titre du prêt */}
            <div className="md:col-span-2">
              <label
                htmlFor="titre_pret"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Titre du prêt *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileTextIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("titre_pret")}
                  type="text"
                  id="titre_pret"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.titre_pret
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Ex: Prêt logement, Prêt automobile..."
                />
              </div>
              {errors.titre_pret && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.titre_pret.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description_pret"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileTextIcon className="h-5 w-5 text-blue-500" />
                </div>
                <textarea
                  {...register("description_pret")}
                  id="description_pret"
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.description_pret
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none`}
                  placeholder="Description détaillée du prêt..."
                />
              </div>
              {errors.description_pret && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.description_pret.message}
                </p>
              )}
            </div>

            {/* Montant */}
            <div>
              <label
                htmlFor="montant_pret"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Montant du prêt *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LandmarkIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("montant_pret")}
                  type="text"
                  id="montant_pret"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.montant_pret
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="0.00"
                />
              </div>
              {errors.montant_pret && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.montant_pret.message}
                </p>
              )}
            </div>

            {/* Période */}
            <div>
              <label
                htmlFor="periode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Période (mois) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ClockIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("periode")}
                  type="number"
                  id="periode"
                  min="1"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.periode
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="12"
                />
              </div>
              {errors.periode && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.periode.message}
                </p>
              )}
            </div>

            {/* Taux */}
            <div>
              <label
                htmlFor="taux_pret"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Taux d'intérêt (%) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PercentIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("taux_pret")}
                  type="text"
                  id="taux_pret"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.taux_pret
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="15.00"
                />
              </div>
              {errors.taux_pret && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.taux_pret.message}
                </p>
              )}
            </div>

            {/* Date du prêt */}
            <div>
              <label
                htmlFor="date_pret"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Date du prêt *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("date_pret")}
                  type="date"
                  id="date_pret"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.date_pret
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
              </div>
              {errors.date_pret && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.date_pret.message}
                </p>
              )}
            </div>

            {/* Statut */}
            <div>
              <label
                htmlFor="statut_pret"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Statut *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileTextIcon className="h-5 w-5 text-blue-500" />
                </div>
                <select
                  {...register("statut_pret")}
                  id="statut_pret"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                    errors.statut_pret
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                >
                  <option value="EN COURS">En cours</option>
                  <option value="TERMINE">Terminé</option>
                  <option value="IMPAYE">Impayé</option>
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
              {errors.statut_pret && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.statut_pret.message}
                </p>
              )}
            </div>

            {/* Approbation */}
            <div>
              <label
                htmlFor="approbation_pret"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Approbation *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileTextIcon className="h-5 w-5 text-blue-500" />
                </div>
                <select
                  {...register("approbation_pret")}
                  id="approbation_pret"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                    errors.approbation_pret
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                >
                  <option value="EN_ATTENTE">En attente</option>
                  <option value="APPROUVE">Approuvé</option>
                  <option value="REFUSE">Refusé</option>
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
              {errors.approbation_pret && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.approbation_pret.message}
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
                  Ajouter le prêt
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}






