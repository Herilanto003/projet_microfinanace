import React from "react";
import {
  ArrowLeftIcon,
  HandCoinsIcon,
  FileTextIcon,
  LandmarkIcon,
  UserIcon,
  CalendarIcon,
  EditIcon,
  BadgeCheckIcon,
  BadgeXIcon,
  ClockIcon,
  PercentIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  IdCardIcon,
  TagIcon,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useGetPretByIdQuery } from "../../redux/api/pretApi";
import { toast } from "react-toastify";

export default function PretDisplayPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: pretData, isLoading, isError, error } = useGetPretByIdQuery(id);

  const handleBack = () => {
    navigate("/compte/admin/prets");
  };

  const handleEdit = () => {
    navigate(`/compte/admin/prets/edit/${id}`);
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

  // Fonction pour formater la date avec heure
  const formatDateTime = (dateString) => {
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
      case "EN COURS":
        return {
          icon: BadgeCheckIcon,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          label: "En cours",
        };
      case "TERMINE":
        return {
          icon: BadgeCheckIcon,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          label: "Terminé",
        };
      case "IMPAYE":
        return {
          icon: BadgeXIcon,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          label: "Impayé",
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

  // Fonction pour obtenir l'icône et la couleur de l'approbation
  const getApprovalInfo = (approbation) => {
    switch (approbation) {
      case "APPROUVE":
        return {
          icon: BadgeCheckIcon,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          label: "Approuvé",
        };
      case "EN_ATTENTE":
        return {
          icon: ClockIcon,
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          label: "En attente",
        };
      case "REFUSE":
        return {
          icon: BadgeXIcon,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          label: "Refusé",
        };
      default:
        return {
          icon: ClockIcon,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-900/30",
          label: approbation,
        };
    }
  };

  // Fonction pour formater le montant
  const formatMontant = (montant) => {
    if (!montant) return "0.00 Ar";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 2,
    }).format(parseFloat(montant));
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
            <HandCoinsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Détails du prêt
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
                    index === 0 || index === 1 || index === 7
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
            Impossible de charger les données du prêt. Veuillez réessayer.
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

  const pret = pretData?.data;
  const StatusIcon = getStatusInfo(pret?.statut_pret).icon;
  const ApprovalIcon = getApprovalInfo(pret?.approbation_pret).icon;

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
            <HandCoinsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Détails du prêt
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Informations complètes sur le prêt et le client
            </p>
          </div>
        </div>

        {/* Badges de statut et approbation */}
        <div className="flex gap-3">
          {pret?.statut_pret && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                getStatusInfo(pret.statut_pret).bgColor
              }`}
            >
              <StatusIcon
                className={`h-5 w-5 ${getStatusInfo(pret.statut_pret).color}`}
              />
              <span
                className={`font-medium ${
                  getStatusInfo(pret.statut_pret).color
                }`}
              >
                {getStatusInfo(pret.statut_pret).label}
              </span>
            </div>
          )}
          {pret?.approbation_pret && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                getApprovalInfo(pret.approbation_pret).bgColor
              }`}
            >
              <ApprovalIcon
                className={`h-5 w-5 ${
                  getApprovalInfo(pret.approbation_pret).color
                }`}
              />
              <span
                className={`font-medium ${
                  getApprovalInfo(pret.approbation_pret).color
                }`}
              >
                {getApprovalInfo(pret.approbation_pret).label}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Carte des informations du prêt */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
            <HandCoinsIcon className="h-5 w-5 text-blue-500" />
            Informations du prêt
          </h2>

          <div className="space-y-6">
            {/* Titre et Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre du prêt
              </label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <FileTextIcon className="h-5 w-5 text-blue-500" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {pret?.titre_pret || "Non spécifié"}
                </span>
              </div>
            </div>

            {pret?.description_pret && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <FileTextIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-gray-900 dark:text-white">
                    {pret.description_pret}
                  </p>
                </div>
              </div>
            )}

            {/* Montant, Période et Taux */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Montant
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <LandmarkIcon className="h-5 w-5 text-green-500" />
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatMontant(pret?.montant_pret)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Période
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <ClockIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {pret?.periode || "0"} mois
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Taux d'intérêt
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <PercentIcon className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {pret?.taux_pret || "0.00"}%
                  </span>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date du prêt
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white">
                    {formatDate(pret?.date_pret)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de création
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <CalendarIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white">
                    {formatDateTime(pret?.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Résumé du prêt
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-100 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    #{pret?.id}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ID du prêt
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {pret?.periode || "0"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Mois
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {pret?.taux_pret || "0"}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Taux
                  </div>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {pret?.statut_pret === "EN COURS"
                      ? "🟢"
                      : pret?.statut_pret === "TERMINE"
                      ? "✅"
                      : "🔴"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {pret?.statut_pret || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte des informations du client */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-blue-500" />
            Informations du client
          </h2>

          <div className="space-y-6">
            {/* Nom complet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom complet
              </label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <UserIcon className="h-5 w-5 text-blue-500" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {pret?.client
                    ? `${pret.client.prenom_client} ${pret.client.nom_client}`
                    : "Client non spécifié"}
                </span>
              </div>
            </div>

            {/* CIN */}
            {pret?.client?.cin_client && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Numéro CIN
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <IdCardIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-900 dark:text-white font-mono">
                    {pret.client.cin_client}
                  </span>
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Téléphone
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <PhoneIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-900 dark:text-white">
                    {pret?.client?.telephone_client || "Non spécifié"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <MailIcon className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-900 dark:text-white">
                    {pret?.client?.email_client || "Non spécifié"}
                  </span>
                </div>
              </div>
            </div>

            {/* Adresse */}
            {pret?.client?.adresse_client && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adresse
                </label>
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <MapPinIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-gray-900 dark:text-white">
                    {pret.client.adresse_client}
                  </p>
                </div>
              </div>
            )}

            {/* Informations supplémentaires du client */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Détails du client
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-100 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    #{pret?.client?.id}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ID Client
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
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






