import {
  ArrowLeftIcon,
  LandmarkIcon,
  FileTextIcon,
  CalendarIcon,
  PlusIcon,
  BuildingIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { useSaveTransactionMutation } from "../../redux/api/transactionApi";
import { useGetComptesQuery } from "../../redux/api/compteApi";
import { toast } from "react-toastify";

// Schema de validation avec Zod
const transactionSchema = z.object({
  nom_transaction: z.string().min(1, "Le nom de la transaction est requis"),
  description_transaction: z.string().min(1, "La description est requise"),
  date_transaction: z.string().min(1, "La date est requise"),
  type_transaction: z.enum(["DEPOT", "RETRAIT"], {
    errorMap: () => ({ message: "Le type de transaction est requis" }),
  }),
  compte_id: z.string().min(1, "Le compte est requis"),
  montant_transaction: z
    .string()
    .min(1, "Le montant est requis")
    .regex(/^\d+(\.\d{1,2})?$/, "Le montant doit être un nombre valide")
    .refine((val) => parseFloat(val) > 0, "Le montant doit être supérieur à 0"),
});

export default function TransactionAddPage() {
  const navigate = useNavigate();
  const [createTransaction, { isLoading: isCreating }] =
    useSaveTransactionMutation();

  // Récupération de la liste des comptes
  const {
    data: comptesData,
    isLoading: isLoadingComptes,
    error: comptesError,
  } = useGetComptesQuery();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type_transaction: "DEPOT",
      date_transaction: new Date().toISOString().split("T")[0], // Date du jour par défaut
    },
  });

  // Surveiller le type de transaction pour l'affichage conditionnel
  const typeTransaction = watch("type_transaction");
  const compteId = watch("compte_id");

  // Effet pour gérer les erreurs de chargement des comptes
  useEffect(() => {
    if (comptesError) {
      toast.error("Erreur lors du chargement des comptes");
      console.error("Erreur comptes:", comptesError);
    }
  }, [comptesError]);

  const onSubmit = async (data) => {
    try {
      // Conversion du montant en number
      const transactionData = {
        ...data,
        montant_transaction: parseFloat(data.montant_transaction),
        compte_id: parseInt(data.compte_id),
      };

      const result = await createTransaction(transactionData).unwrap();

      if (result.success) {
        toast.success("Transaction ajoutée avec succès !");
        reset();
        navigate("/compte/admin/transactions");
      } else {
        // Gestion des erreurs spécifiques du backend
        const errorMessage = getErrorMessage(result.message);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);

      // Gestion des erreurs spécifiques du backend
      if (error.data?.message) {
        const errorMessage = getErrorMessage(error.data.message);
        toast.error(errorMessage);
      } else {
        toast.error("Erreur lors de l'ajout de la transaction");
      }
    }
  };

  // Fonction pour traduire les messages d'erreur du backend
  const getErrorMessage = (message) => {
    switch (message) {
      case "COMPTE_NOT_FOUND":
        return "Compte non trouvé";
      case "COMPTE_NOT_YET_ACTIVE":
        return "Le compte n'est pas actif";
      case "IMPOSSIBLE_TRANSACTION_WITH_SOLDE_LESS_THAN_TRANSACTION_AMOUNT":
        return "Solde insuffisant pour effectuer ce retrait";
      case "NO_TRANSACTION_TYPE_SELECTED":
        return "Type de transaction non sélectionné";
      default:
        return message || "Erreur lors de l'ajout de la transaction";
    }
  };

  const handleBack = () => {
    navigate("/compte/admin/transactions");
  };

  const handleReset = () => {
    reset({
      type_transaction: "DEPOT",
      date_transaction: new Date().toISOString().split("T")[0],
    });
  };

  // Formatage de l'affichage des comptes pour la liste déroulante
  const formatCompteDisplay = (compte) => {
    return `${compte.id} - ${compte.nom_compte}`;
  };

  // Obtenir le solde du compte sélectionné
  const getSelectedCompteSolde = () => {
    if (!compteId || !comptesData?.data) return null;
    const compte = comptesData.data.find((c) => c.id === parseInt(compteId));
    return compte ? parseFloat(compte.solde_compte) : null;
  };

  const selectedCompteSolde = getSelectedCompteSolde();

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
          Nouvelle transaction
        </h1>
      </div>

      {/* Formulaire */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom de la transaction */}
            <div className="md:col-span-2">
              <label
                htmlFor="nom_transaction"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nom de la transaction *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileTextIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("nom_transaction")}
                  type="text"
                  id="nom_transaction"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.nom_transaction
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="Ex: Dépôt salaire, Retrait espèces..."
                />
              </div>
              {errors.nom_transaction && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.nom_transaction.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description_transaction"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Description *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FileTextIcon className="h-5 w-5 text-blue-500" />
                </div>
                <textarea
                  {...register("description_transaction")}
                  id="description_transaction"
                  rows={3}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.description_transaction
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none`}
                  placeholder="Description détaillée de la transaction..."
                />
              </div>
              {errors.description_transaction && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.description_transaction.message}
                </p>
              )}
            </div>

            {/* Type de transaction */}
            <div>
              <label
                htmlFor="type_transaction"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Type de transaction *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {typeTransaction === "DEPOT" ? (
                    <ArrowUpIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <select
                  {...register("type_transaction")}
                  id="type_transaction"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                    errors.type_transaction
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                >
                  <option value="DEPOT">Dépôt</option>
                  <option value="RETRAIT">Retrait</option>
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
              {errors.type_transaction && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.type_transaction.message}
                </p>
              )}
            </div>

            {/* Date de la transaction */}
            <div>
              <label
                htmlFor="date_transaction"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Date de la transaction *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("date_transaction")}
                  type="date"
                  id="date_transaction"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.date_transaction
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                />
              </div>
              {errors.date_transaction && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.date_transaction.message}
                </p>
              )}
            </div>

            {/* Montant */}
            <div>
              <label
                htmlFor="montant_transaction"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Montant *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LandmarkIcon className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  {...register("montant_transaction")}
                  type="text"
                  id="montant_transaction"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.montant_transaction
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`}
                  placeholder="0.00"
                />
              </div>
              {errors.montant_transaction && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.montant_transaction.message}
                </p>
              )}
              {typeTransaction === "RETRAIT" &&
                selectedCompteSolde !== null && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Solde actuel du compte:{" "}
                    {selectedCompteSolde.toLocaleString("fr-FR")} Ar
                  </p>
                )}
            </div>

            {/* Compte - Liste déroulante */}
            <div>
              <label
                htmlFor="compte_id"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Compte *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingIcon className="h-5 w-5 text-blue-500" />
                </div>
                <select
                  {...register("compte_id")}
                  id="compte_id"
                  disabled={isLoadingComptes}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                    errors.compte_id
                      ? "border-blue-500 focus:ring-blue-500 dark:border-blue-400"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-400"
                  } bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 disabled:dark:bg-gray-600`}
                >
                  <option value="">Sélectionnez un compte</option>
                  {comptesData?.data?.map((compte) => (
                    <option key={compte.id} value={compte.id}>
                      {formatCompteDisplay(compte)}
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
              {isLoadingComptes && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  Chargement des comptes...
                </p>
              )}
              {errors.compte_id && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  {errors.compte_id.message}
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
              disabled={isSubmitting || isCreating || isLoadingComptes}
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
                  Créer la transaction
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}






