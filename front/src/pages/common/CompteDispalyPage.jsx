import React from "react";
import {
  ArrowLeftIcon,
  BuildingIcon,
  FileTextIcon,
  LandmarkIcon,
  UserIcon,
  CalendarIcon,
  EditIcon,
  BadgeCheckIcon,
  BadgeXIcon,
  PauseIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useGetCompteByIdQuery } from "../../redux/api/compteApi";
import { toast } from "react-toastify";

export default function CompteDisplayPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: compteData,
    isLoading,
    isError,
    error,
  } = useGetCompteByIdQuery(id);

  const handleBack = () => {
    navigate("/compte/admin/comptes");
  };

  const handleEdit = () => {
    navigate(`/compte/admin/comptes/edit/${id}`);
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour obtenir l'icône et la couleur du statut
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
            <LandmarkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Détails du compte
          </h1>
        </div>

        {/* Squelette de chargement stylisé */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className={
                    index === 0 || index === 2 || index === 5
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
            Impossible de charger les données du compte. Veuillez réessayer.
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

  const compte = compteData?.data;
  const StatusIcon = getStatusInfo(compte?.statut_compte).icon;

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <LandmarkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Détails du compte
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Informations complètes sur le compte bancaire
            </p>
          </div>
        </div>

        {/* Badge de statut */}
        {compte?.statut_compte && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              getStatusInfo(compte.statut_compte).bgColor
            }`}
          >
            <StatusIcon
              className={`h-5 w-5 ${getStatusInfo(compte.statut_compte).color}`}
            />
            <span
              className={`font-medium ${
                getStatusInfo(compte.statut_compte).color
              }`}
            >
              {getStatusInfo(compte.statut_compte).label}
            </span>
          </div>
        )}
      </div>

      {/* Carte des informations du compte */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom du compte */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du compte
              </label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <BuildingIcon className="h-5 w-5 text-blue-500" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {compte?.nom_compte || "Non spécifié"}
                </span>
              </div>
            </div>

            {/* Description */}
            {compte?.description_compte && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <FileTextIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-gray-900 dark:text-white">
                    {compte.description_compte}
                  </p>
                </div>
              </div>
            )}

            {/* Solde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Solde actuel
              </label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <LandmarkIcon className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {compte?.solde_compte
                    ? new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "MGA",
                        minimumFractionDigits: 2,
                      }).format(parseFloat(compte.solde_compte))
                    : "0.00 Ar"}
                </span>
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Statut du compte
              </label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <StatusIcon
                  className={`h-5 w-5 ${
                    getStatusInfo(compte?.statut_compte).color
                  }`}
                />
                <span
                  className={`font-medium ${
                    getStatusInfo(compte?.statut_compte).color
                  }`}
                >
                  {getStatusInfo(compte?.statut_compte).label}
                </span>
              </div>
            </div>

            {/* Client */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client associé
              </label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <UserIcon className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {compte?.client
                      ? `${compte.client.prenom_client} ${compte.client.nom_client}`
                      : "Client non spécifié"}
                  </span>
                  {compte?.client && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      ID: {compte.client.id} | Tél:{" "}
                      {compte.client.telephone_client} | Email:{" "}
                      {compte.client.email_client}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Dates de création et modification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de création
              </label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                <span className="text-gray-900 dark:text-white">
                  {formatDate(compte?.created_at)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dernière modification
              </label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                <span className="text-gray-900 dark:text-white">
                  {formatDate(compte?.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Informations supplémentaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {compte?.statut_compte === "Active" ? "✅" : "❌"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Compte{" "}
                  {compte?.statut_compte === "Active" ? "Actif" : "Inactif"}
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  #{compte?.id}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ID du compte
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              <ArrowLeftIcon size={18} />
              Retour
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <EditIcon size={18} />
              Modifier le compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}






