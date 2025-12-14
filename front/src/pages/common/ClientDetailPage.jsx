import React from "react";
import { useParams } from "react-router";
import { useGetClientByIdQuery } from "../../redux/api/clientApi";
import {
  IdCardIcon,
  IdCardLanyardIcon,
  Mail,
  MapPinCheck,
  PhoneIcon,
  UserCircleIcon,
} from "lucide-react";

export default function ClientDetailPage() {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetClientByIdQuery(id);

  // petites couleurs utilitaires pour icônes
  const iconClass = "text-violet-500 dark:text-violet-300";

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center gap-6 p-6 md:p-10">
      {/* Header */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-blue-600 via-violet-600 to-violet-400/80 rounded-xl p-6 shadow-lg text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-gray-50/20 rounded-full p-1">
            <UserCircleIcon size={64} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Détails du client</h1>
            <p className="text-sm opacity-90">
              ID CLIENT : <span className="font-medium">{id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-gray-50/20 hover:bg-gray-50/30 transition-colors text-sm px-4 py-2 rounded-md">
            Modifier
          </button>
          <button className="bg-gray-50/10 hover:bg-gray-50/20 transition-colors text-sm px-4 py-2 rounded-md">
            Supprimer
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-4xl">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 md:p-8">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-14 bg-slate-200 dark:bg-gray-700 rounded"></div>
                <div className="h-14 bg-slate-200 dark:bg-gray-700 rounded"></div>
                <div className="h-14 bg-slate-200 dark:bg-gray-700 rounded"></div>
                <div className="h-14 bg-slate-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-blue-600">
              Erreur de récupération des données
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`${iconClass} p-2 bg-gray-100 dark:bg-gray-50/5 rounded-md`}
                  >
                    {" "}
                    <IdCardIcon size={28} />{" "}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Nom complet
                    </p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {data?.data.nom_client} {data?.data.prenom_client}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`${iconClass} p-2 bg-gray-100 dark:bg-gray-50/5 rounded-md`}
                  >
                    {" "}
                    <IdCardLanyardIcon size={28} />{" "}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      CIN
                    </p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {data?.data.cin_client}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`${iconClass} p-2 bg-gray-100 dark:bg-gray-50/5 rounded-md`}
                  >
                    {" "}
                    <PhoneIcon size={24} />{" "}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Numéro téléphone
                    </p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {data?.data.telephone_client}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className={`${iconClass} p-2 bg-gray-100 dark:bg-gray-50/5 rounded-md`}
                  >
                    {" "}
                    <Mail size={24} />{" "}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Adresse email
                    </p>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                      {data?.data.email_client}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`${iconClass} p-2 bg-gray-100 dark:bg-gray-50/5 rounded-md`}
                >
                  {" "}
                  <MapPinCheck size={24} />{" "}
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Adresse domicile
                  </p>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-100">
                    {data?.data.adresse_client}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}






