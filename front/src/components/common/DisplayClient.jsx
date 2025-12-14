import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  IdCard,
  Home,
  UserCircle,
} from "lucide-react";
import BaseModal from "./BaseModal";
import { useGetClientByIdQuery } from "../../redux/api/clientApi";

export default function DisplayClient({ isOpen, onClose, idClient }) {
  // 🧩 Données fictives
  const client = {
    id: 1,
    nom_client: "Rakoto",
    prenom_client: "Hery",
    cin_client: "123456789012",
    telephone_client: "+261 34 12 345 67",
    email_client: "hery.rakoto@example.com",
    adresse_client: "Lot II M 23, Antananarivo, Madagascar",
  };

  const { data, isError, isLoading } = useGetClientByIdQuery(idClient);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      variant="display"
      title="Détails du client"
    >
      {/* Contenu principal */}

      {isLoading ? (
        <p>Chargement ...</p>
      ) : isError ? (
        <p>Erreur lors de récupération des données</p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {/* Avatar / icône client */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-blue-500 shadow-md">
            <UserCircle className="w-10 h-10 text-white" />
          </div>

          {/* Nom complet */}
          <h2 className="text-2xl font-semibold text-violet-700 dark:text-violet-300">
            {client.prenom_client} {client.nom_client}
          </h2>

          {/* Informations détaillées */}
          <div className="w-full mt-4 space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 dark:bg-violet-950/40">
              <IdCard className="w-5 h-5 text-violet-600 dark:text-violet-300" />
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                CIN :
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {client.cin_client}
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 dark:bg-violet-950/40">
              <Phone className="w-5 h-5 text-violet-600 dark:text-violet-300" />
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                Téléphone :
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {client.telephone_client}
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 dark:bg-violet-950/40">
              <Mail className="w-5 h-5 text-violet-600 dark:text-violet-300" />
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                Email :
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {client.email_client}
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 dark:bg-violet-950/40">
              <Home className="w-5 h-5 text-violet-600 dark:text-violet-300" />
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                Adresse :
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {client.adresse_client}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            <User className="inline-block w-4 h-4 mr-1 text-violet-500" />
            ID Client : {client.id}
          </div>
        </div>
      )}
    </BaseModal>
  );
}






