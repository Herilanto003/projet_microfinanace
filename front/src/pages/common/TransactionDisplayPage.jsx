import React from "react";
import {
  ArrowLeftIcon,
  LandmarkIcon,
  FileTextIcon,
  CalendarIcon,
  UserIcon,
  BuildingIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  IdCardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EditIcon,
  BadgeCheckIcon,
  BadgeXIcon,
  PauseIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useGetInfoTransactionQuery } from "../../redux/api/transactionApi";
import { toast } from "react-toastify";

export default function TransactionDisplayPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: transactionData,
    isLoading,
    isError,
    error,
  } = useGetInfoTransactionQuery(id);

  const handleBack = () => {
    navigate("/compte/admin/transactions");
  };

  const handleEdit = () => {
    navigate(`/compte/admin/transactions/edit/${id}`);
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fonction pour formater le montant
  const formatMontant = (montant) => {
    if (!montant) return "0.00 Ar";
    const montantNumber = parseFloat(montant);
    return (
      new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(montantNumber) + " Ar"
    );
  };

  // Fonction pour obtenir les informations du type de transaction
  const getTransactionTypeInfo = (type) => {
    switch (type?.toUpperCase()) {
      case "DEPOT":
        return {
          icon: ArrowUpIcon,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          label: "Dépôt",
          description: "Entrée d'argent sur le compte",
        };
      case "RETRAIT":
        return {
          icon: ArrowDownIcon,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          label: "Retrait",
          description: "Sortie d'argent du compte",
        };
      case "TRANSFERT":
        return {
          icon: LandmarkIcon,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          label: "Transfert",
          description: "Transfert entre comptes",
        };
      default:
        return {
          icon: LandmarkIcon,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-900/30",
          label: type || "Inconnu",
          description: "Type de transaction non spécifié",
        };
    }
  };

  // Fonction pour obtenir l'icône et la couleur du statut du compte
  const getStatusInfo = (statut) => {
    switch (statut) {
      case "Active":
        return {
          icon: BadgeCheckIcon,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          label: "Actif",
        };
      case "Inactive":
        return {
          icon: BadgeXIcon,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          label: "Inactif",
        };
      case "Suspendu":
        return {
          icon: PauseIcon,
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-100 dark:bg-orange-900/30",
          label: "Suspendu",
        };
      default:
        return {
          icon: BadgeCheckIcon,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-900/30",
          label: statut,
        };
    }
  };

  // Design amélioré pour le chargement
  if (isLoading) {
    return (
      <div className="px-6 py-8 max-w-6xl mx-auto">
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
            <LandmarkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Détails de la transaction
          </h1>
        </div>

        {/* Squelette de chargement stylisé */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className={
                    index === 0 || index === 1 || index === 6 || index === 7
                      ? "md:col-span-2"
                      : ""
                  }
                >
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2 animate-pulse"></div>
                  <div className="w-full py-3 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse h-12"></div>
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
      <div className="px-6 py-8 max-w-6xl mx-auto">
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
            Impossible de charger les données de la transaction. Veuillez
            réessayer.
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

  const transaction = transactionData?.data;
  const TypeIcon = getTransactionTypeInfo(transaction?.type_transaction).icon;
  const StatusIcon = getStatusInfo(transaction?.statut_compte).icon;

  return (
    <div className="px-6 py-8 max-w-6xl mx-auto">
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <LandmarkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Détails de la transaction
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Informations complètes sur la transaction bancaire
            </p>
          </div>
        </div>

        {/* Badge de type de transaction */}
        {transaction?.type_transaction && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              getTransactionTypeInfo(transaction.type_transaction).bgColor
            }`}
          >
            <TypeIcon
              className={`h-5 w-5 ${
                getTransactionTypeInfo(transaction.type_transaction).color
              }`}
            />
            <span
              className={`font-medium ${
                getTransactionTypeInfo(transaction.type_transaction).color
              }`}
            >
              {getTransactionTypeInfo(transaction.type_transaction).label}
            </span>
          </div>
        )}
      </div>

      {/* Carte des informations de la transaction */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
          <LandmarkIcon className="h-5 w-5 text-blue-500" />
          Informations de la transaction
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID de la transaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Transaction
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <FileTextIcon className="h-5 w-5 text-blue-500" />
              <span className="text-gray-900 dark:text-white font-mono font-medium">
                {transaction?.transaction_id}
              </span>
            </div>
          </div>

          {/* Nom de la transaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom de la transaction
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <FileTextIcon className="h-5 w-5 text-blue-500" />
              <span className="text-gray-900 dark:text-white font-medium">
                {transaction?.nom_transaction || "Non spécifié"}
              </span>
            </div>
          </div>

          {/* Description */}
          {transaction?.description_transaction && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <FileTextIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-gray-900 dark:text-white">
                  {transaction.description_transaction}
                </p>
              </div>
            </div>
          )}

          {/* Montant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Montant
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <TypeIcon
                className={`h-5 w-5 ${
                  getTransactionTypeInfo(transaction?.type_transaction).color
                }`}
              />
              <span
                className={`text-2xl font-bold ${
                  getTransactionTypeInfo(transaction?.type_transaction).color
                }`}
              >
                {formatMontant(transaction?.montant_transaction)}
              </span>
            </div>
          </div>

          {/* Type de transaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type de transaction
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <TypeIcon
                className={`h-5 w-5 ${
                  getTransactionTypeInfo(transaction?.type_transaction).color
                }`}
              />
              <div>
                <span
                  className={`font-medium ${
                    getTransactionTypeInfo(transaction?.type_transaction).color
                  }`}
                >
                  {getTransactionTypeInfo(transaction?.type_transaction).label}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {
                    getTransactionTypeInfo(transaction?.type_transaction)
                      .description
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Date de la transaction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date de la transaction
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
              <span className="text-gray-900 dark:text-white">
                {formatDate(transaction?.date_transaction)}
              </span>
            </div>
          </div>

          {/* Évolution du solde */}
          {transaction?.solde_avant && transaction?.solde_apres && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Évolution du solde
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <TrendingUpIcon className="h-6 w-6 text-blue-500 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Solde avant
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatMontant(transaction.solde_avant)}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <LandmarkIcon className="h-6 w-6 text-green-500 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Transaction
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      getTransactionTypeInfo(transaction?.type_transaction)
                        .color
                    }`}
                  >
                    {transaction?.type_transaction === "DEPOT" ? "+ " : "- "}
                    {formatMontant(transaction.montant_transaction)}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <TrendingUpIcon className="h-6 w-6 text-purple-500 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Solde après
                  </span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {formatMontant(transaction.solde_apres)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Informations du compte */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
          <BuildingIcon className="h-5 w-5 text-blue-500" />
          Compte associé
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID du compte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Compte
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <BuildingIcon className="h-5 w-5 text-blue-500" />
              <span className="text-gray-900 dark:text-white font-mono font-medium">
                {transaction?.compte_id}
              </span>
            </div>
          </div>

          {/* Nom du compte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom du compte
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <BuildingIcon className="h-5 w-5 text-blue-500" />
              <span className="text-gray-900 dark:text-white font-medium">
                {transaction?.nom_compte || "Non spécifié"}
              </span>
            </div>
          </div>

          {/* Description du compte */}
          {transaction?.description_compte && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description du compte
              </label>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <FileTextIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-gray-900 dark:text-white">
                  {transaction.description_compte}
                </p>
              </div>
            </div>
          )}

          {/* Solde actuel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Solde actuel
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <LandmarkIcon className="h-5 w-5 text-green-500" />
              <span className="text-xl font-bold text-green-600 dark:text-green-400">
                {formatMontant(transaction?.solde_compte)}
              </span>
            </div>
          </div>

          {/* Statut du compte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut du compte
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <StatusIcon
                className={`h-5 w-5 ${
                  getStatusInfo(transaction?.statut_compte).color
                }`}
              />
              <span
                className={`font-medium ${
                  getStatusInfo(transaction?.statut_compte).color
                }`}
              >
                {getStatusInfo(transaction?.statut_compte).label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Informations du client */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-blue-500" />
          Client titulaire
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Client
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <UserIcon className="h-5 w-5 text-blue-500" />
              <span className="text-gray-900 dark:text-white font-mono font-medium">
                {transaction?.client_id}
              </span>
            </div>
          </div>

          {/* Nom complet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom complet
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <UserIcon className="h-5 w-5 text-blue-500" />
              <span className="text-gray-900 dark:text-white font-medium">
                {transaction
                  ? `${transaction.prenom_client} ${transaction.nom_client}`
                  : "Non spécifié"}
              </span>
            </div>
          </div>

          {/* CIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CIN
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <IdCardIcon className="h-5 w-5 text-blue-500" />
              <span className="text-gray-900 dark:text-white">
                {transaction?.cin_client || "Non spécifié"}
              </span>
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Téléphone
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <PhoneIcon className="h-5 w-5 text-blue-500" />
              <span className="text-gray-900 dark:text-white">
                {transaction?.telephone_client || "Non spécifié"}
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <MailIcon className="h-5 w-5 text-blue-500" />
              <span className="text-gray-900 dark:text-white">
                {transaction?.email_client || "Non spécifié"}
              </span>
            </div>
          </div>

          {/* Adresse */}
          {transaction?.adresse_client && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adresse
              </label>
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <MapPinIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-gray-900 dark:text-white">
                  {transaction.adresse_client}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
        >
          <ArrowLeftIcon size={18} />
          Retour
        </button>
      </div>
    </div>
  );
}






