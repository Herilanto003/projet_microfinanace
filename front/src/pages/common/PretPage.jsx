import {
  EditIcon,
  EyeIcon,
  MoreVertical,
  TrashIcon,
  HandCoinsIcon,
  SunIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  AlertTriangleIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useDeletePretMutation,
  useGetPretsQuery,
} from "../../redux/api/pretApi";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setTitleHeader } from "../../redux/features/titleHeaderSlice";

export default function PretPage() {
  const dispatch = useDispatch();
  dispatch(setTitleHeader({ title: "Prêts" }));

  const { data, isLoading, isError } = useGetPretsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPrets, setFilteredPrets] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pretToDelete, setPretToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [deletePret, { isLoading: isLoadingDelete, isError: isErrorDelete }] =
    useDeletePretMutation();

  useEffect(() => {
    console.log(data);
    if (data?.data) {
      setFilteredPrets(data.data);
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (data?.data && searchTerm) {
      const filtered = data.data.filter(
        (pret) =>
          pret.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          pret.titre_pret.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pret.description_pret
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${pret.client.nom_client} ${pret.client.prenom_client}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          pret.montant_pret.includes(searchTerm)
      );
      setFilteredPrets(filtered);
    } else if (data?.data) {
      setFilteredPrets(data.data);
    }
  }, [searchTerm, data]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (pret) => {
    setPretToDelete(pret);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setPretToDelete(null);
    }, 300);
  };

  const handleConfirmDelete = async () => {
    if (!pretToDelete) return;

    try {
      console.log("Suppression du prêt:", pretToDelete.id);

      const response = await deletePret(pretToDelete.id);

      if (isErrorDelete == false) {
        toast.success("Suppression avec succès !", { theme: "colored" });
      } else {
        toast.error("Erreur de suppression !", { theme: "colored" });
      }

      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Fonction pour formater le statut avec des couleurs
  const getStatusBadge = (statut) => {
    const statusConfig = {
      "EN COURS": {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        label: "En cours",
      },
      TERMINE: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        label: "Terminé",
      },
      IMPAYE: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        label: "Impayé",
      },
    };

    const config = statusConfig[statut] || {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      label: statut,
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Fonction pour formater l'approbation avec des couleurs
  const getApprovalBadge = (approbation) => {
    const approvalConfig = {
      APPROUVE: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        label: "Approuvé",
      },
      EN_ATTENTE: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        label: "En attente",
      },
      REFUSE: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        label: "Refusé",
      },
    };

    const config = approvalConfig[approbation] || {
      color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      label: approbation,
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  // Fonction pour formater le montant
  const formatMontant = (montant) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parseFloat(montant));
  };

  return (
    <div className="px-10 py-5 flex flex-col w-full gap-5">
      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay avec animation de fade */}
          <div
            className={`absolute inset-0 bg-gray-800/50 dark:bg-gray-300/50 transition-opacity duration-300 ${
              showDeleteModal ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleCloseModal}
          />

          {/* Modal avec animation de fade et scale */}
          <div
            className={`relative bg-gray-50 dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${
              showDeleteModal ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <div className="p-6">
              {/* En-tête du modal */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <AlertTriangleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Confirmer la suppression
                </h3>
              </div>

              {/* Contenu du modal */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Êtes-vous sûr de vouloir supprimer le prêt :
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {pretToDelete?.titre_pret}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {pretToDelete?.description_pret}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-3">
                  ⚠️ Cette action est irréversible.
                </p>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isLoadingDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {isLoadingDelete ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    <>
                      <TrashIcon size={16} />
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-between items-center gap-5 text-4xl border-b border-b-gray-500 pb-5 px-5 text-gray-800 dark:text-gray-200 dark:border-b-gray-200">
        <div className="flex items-center gap-4">
          <HandCoinsIcon size={32} />
          <h1 className="text-2xl font-semibold">Les prêts</h1>
        </div>
      </div>

      {/* Barre de recherche et bouton d'ajout */}
      <div className="w-full flex justify-between items-center gap-4 px-5">
        {/* Champ de recherche à gauche */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-blue-500" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un prêt..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
          />
        </div>

        {/* Bouton d'ajout à droite */}
        <Link
          to={"/compte/admin/prets/add"}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon size={20} />
          <span>Ajouter un prêt</span>
        </Link>
      </div>

      <div className="w-full flex justify-start items-start overflow-x-auto">
        <div className="shrink-0 grow">
          {isLoading ? (
            <p className="text-gray-700 dark:text-gray-200">Chargement...</p>
          ) : isError ? (
            <p className="text-blue-600 dark:text-blue-400">
              Erreur de serveur !
            </p>
          ) : (
            <table className="w-full border-separate border-spacing-y-2 shrink-0 text-left text-sm text-gray-700 dark:text-gray-200">
              <thead>
                <tr className="bg-gray-1000/25">
                  <th className="p-3 rounded-tl-lg rounded-bl-lg">#ID</th>
                  <th className="p-3">Titre</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Approbation</th>
                  <th className="p-3">Client</th>
                  <th className="p-3 rounded-tr-lg rounded-br-lg">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPrets?.map((d, index) => (
                  <tr
                    key={d.id}
                    className="bg-gray-50 dark:bg-gray-800 hover:shadow-sm transition-all hover:duration-300 hover:bg-gray-100 dark:hover:bg-blue-900/20"
                  >
                    <td className="h-12 px-3 rounded-tl-lg rounded-bl-lg border-t-2 border-b-2 border-blue-300/15 border-l-2">
                      {d.id}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      <div>
                        <div className="font-medium">{d.titre_pret}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {d.description_pret}
                        </div>
                      </div>
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      {getStatusBadge(d.statut_pret)}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      {getApprovalBadge(d.approbation_pret)}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      <div>
                        <div className="font-medium">
                          {d.client.nom_client} {d.client.prenom_client}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {d.client.telephone_client}
                        </div>
                      </div>
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 rounded-tr-lg rounded-br-lg border-2 border-blue-300/15 flex justify-center items-center gap-2">
                      <button
                        className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        onClick={() =>
                          navigate("/compte/admin/prets/edit/" + d.id)
                        }
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        onClick={() => handleDeleteClick(d)}
                      >
                        <TrashIcon size={16} />
                      </button>
                      <button
                        className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        onClick={() => navigate("/compte/admin/prets/" + d.id)}
                      >
                        <EyeIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPrets?.length === 0 && searchTerm && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      Aucun prêt trouvé pour "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
