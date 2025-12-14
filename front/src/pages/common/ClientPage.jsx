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
  clientApi,
  useDeleteClientMutation,
  useGetClientsQuery,
  useUpdateClientTagMutation,
} from "../../redux/api/clientApi";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setTitleHeader } from "../../redux/features/titleHeaderSlice";

export default function ClientPage() {
  const dispatch = useDispatch();
  dispatch(setTitleHeader({ title: "Clients" }));

  const { data, isLoading, isError } = useGetClientsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [deleteClient, { isLoading: isLoadingDelete, isError: isErrorDelete }] =
    useDeleteClientMutation();
  const [updateClientTag, { isLoading: isLoadingTag, isError: isErrorTag }] =
    useUpdateClientTagMutation();

  useEffect(() => {
    console.log(data);
    if (data?.data) {
      setFilteredClients(data.data);
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (data?.data && searchTerm) {
      const filtered = data.data.filter(
        (client) =>
          client.id
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${client.nom_client} ${client.prenom_client}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          client.email_client
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          client.telephone_client.includes(searchTerm)
      );
      setFilteredClients(filtered);
    } else if (data?.data) {
      setFilteredClients(data.data);
    }
  }, [searchTerm, data]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setClientToDelete(null);
    }, 300);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    setIsDeleting(true);

    // Optimistic cache update: retirer le client localement avant la requête
    const patchResult = dispatch(
      clientApi.util.updateQueryData("getClients", undefined, (draft) => {
        try {
          if (draft && Array.isArray(draft.data)) {
            const idx = draft.data.findIndex((c) => c.id === clientToDelete.id);
            if (idx !== -1) draft.data.splice(idx, 1);
          }
        } catch (e) {
          // en cas de forme inattendue du cache, ne rien faire
        }
      })
    );

    try {
      // Appel à la mutation (attend la résolution et lève si échec)
      // await deleteClient(clientToDelete.id).unwrap();

      await updateClientTag({ id: clientToDelete.id, tag: true }).unwrap();

      toast.success("Suppression avec succès !", { theme: "colored" });
      handleCloseModal();
    } catch (error) {
      // rollback du cache si la suppression a échoué
      if (patchResult && typeof patchResult.undo === "function") {
        patchResult.undo();
      }
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur de suppression !", { theme: "colored" });
    } finally {
      setIsDeleting(false);
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
                  Êtes-vous sûr de vouloir supprimer le client :
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {clientToDelete?.nom_client} {clientToDelete?.prenom_client}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {clientToDelete?.email_client}
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
          <h1 className="text-2xl font-semibold">Les clients</h1>
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
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
          />
        </div>

        {/* Bouton d'ajout à droite */}
        <Link
          to={"/compte/admin/clients/add"}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon size={20} />
          <span>Ajouter un client</span>
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
                  <th className="p-3">Nom complet</th>
                  <th className="p-3">Téléphone</th>
                  <th className="p-3">Adresse email</th>
                  <th className="p-3 rounded-tr-lg rounded-br-lg">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredClients?.map((d, index) => (
                  <tr
                    key={d.id}
                    className="bg-gray-50 dark:bg-gray-800 hover:shadow-sm transition-all hover:duration-300 hover:bg-gray-100 dark:hover:bg-blue-900/20"
                  >
                    <td className="h-12 px-3 rounded-tl-lg rounded-bl-lg border-t-2 border-b-2 border-blue-300/15 border-l-2">
                      {d.id}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      {d.nom_client} {d.prenom_client}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      {d.telephone_client}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      {d.email_client}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 rounded-tr-lg rounded-br-lg border-2 border-blue-300/15 flex justify-center items-center gap-2">
                      <button
                        className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        onClick={() =>
                          navigate("/compte/admin/clients/edit/" + d.id)
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
                          navigate("/compte/admin/clients/" + d.id)
                        }
                      >
                        <EyeIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClients?.length === 0 && searchTerm && (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      Aucun client trouvé pour "{searchTerm}"
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
