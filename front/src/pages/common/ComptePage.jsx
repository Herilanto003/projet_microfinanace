import {
  EditIcon,
  EyeIcon,
  MoreVertical,
  TrashIcon,
  Users2Icon,
  SunIcon,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  AlertTriangleIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useDeleteCompteMutation,
  useGetComptesQuery,
} from "../../redux/api/compteApi";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setTitleHeader } from "../../redux/features/titleHeaderSlice";

export default function ComptePage() {
  const dispatch = useDispatch();
  dispatch(setTitleHeader({ title: "Comptes" }));

  const { data, isLoading, isError } = useGetComptesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredComptes, setFilteredComptes] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [compteToDelete, setCompteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [deleteCompte, { isLoading: isLoadingDelete, isError: isErrorDelete }] =
    useDeleteCompteMutation();

  useEffect(() => {
    console.log(data);
    if (data?.data) {
      setFilteredComptes(data.data);
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (data?.data && searchTerm) {
      const filtered = data.data.filter(
        (compte) =>
          compte.id
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${compte.nom_compte}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${compte.client.nom_client} ${compte.client.prenom_client}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          compte.statut_compte
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          compte.solde_compte.includes(searchTerm)
      );
      setFilteredComptes(filtered);
    } else if (data?.data) {
      setFilteredComptes(data.data);
    }
  }, [searchTerm, data]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (compte) => {
    setCompteToDelete(compte);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setCompteToDelete(null);
    }, 300);
  };

  const handleConfirmDelete = async () => {
    if (!compteToDelete) return;

    try {
      // Ici vous ajouterez la logique de suppression
      // await deleteCompte(compteToDelete.id);
      console.log("Suppression du compte:", compteToDelete.id);

      const response = await deleteCompte(compteToDelete.id);

      if (isErrorDelete == false) {
        toast.success("Suppression avec succès !", { theme: "colored" });
      } else {
        toast.error("Erreur de suppression !", { theme: "colored" });
      }

      // Fermer le modal après suppression
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Fonction pour obtenir les classes CSS selon le statut
  const getStatusClasses = (statut) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";

    if (statut.toLowerCase() === "active") {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
    } else if (statut.toLowerCase() === "inactive") {
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;
    } else {
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
    }
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
                  Êtes-vous sûr de vouloir supprimer le compte :
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {compteToDelete?.nom_compte} {compteToDelete?.prenom_compte}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {compteToDelete?.email_compte}
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
          <Users2Icon size={32} />
          <h1 className="text-2xl font-semibold">Les comptes</h1>
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
            placeholder="Rechercher un compte..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
          />
        </div>

        {/* Bouton d'ajout à droite */}
        <Link
          to={"/compte/admin/comptes/add"}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon size={20} />
          <span>Ajouter un compte</span>
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
                  <th className="p-3">Nom compte</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Solde</th>
                  <th className="p-3 rounded-tr-lg rounded-br-lg">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredComptes?.map((d, index) => (
                  <tr
                    key={d.id}
                    className="bg-gray-50 dark:bg-gray-800 hover:shadow-sm transition-all hover:duration-300 hover:bg-gray-100 dark:hover:bg-blue-900/20"
                  >
                    <td className="h-12 px-3 rounded-tl-lg rounded-bl-lg border-t-2 border-b-2 border-blue-300/15 border-l-2">
                      {d.id}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      {d.nom_compte}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      {`${d.client.nom_client} ${d.client.prenom_client}`}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      <span className={getStatusClasses(d.statut_compte)}>
                        {d.statut_compte}
                      </span>
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      {d.solde_compte}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 rounded-tr-lg rounded-br-lg border-2 border-blue-300/15 flex justify-center items-center gap-2">
                      <button
                        className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        onClick={() =>
                          navigate("/compte/admin/comptes/edit/" + d.id)
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
                        onClick={() =>
                          navigate("/compte/admin/comptes/" + d.id)
                        }
                      >
                        <EyeIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredComptes?.length === 0 && searchTerm && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      Aucun compte trouvé pour "{searchTerm}"
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
