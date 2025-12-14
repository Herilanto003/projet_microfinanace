import {
  EditIcon,
  EyeIcon,
  TrashIcon,
  LandmarkIcon,
  PlusIcon,
  SearchIcon,
  AlertTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  useDeleteTransactionMutation,
  useGetAllTransactionsQuery,
} from "../../redux/api/transactionApi";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setTitleHeader } from "../../redux/features/titleHeaderSlice";

export default function TransactionPage() {
  const dispatch = useDispatch();
  dispatch(setTitleHeader({ title: "Transactions" }));

  const { data, isLoading, isError } = useGetAllTransactionsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [
    deleteTransaction,
    { isLoading: isLoadingDelete, isError: isErrorDelete },
  ] = useDeleteTransactionMutation();

  useEffect(() => {
    console.log(data);
    if (data?.data) {
      setFilteredTransactions(data.data);
    }
  }, [isLoading, data]);

  useEffect(() => {
    if (data?.data && searchTerm) {
      const filtered = data.data.filter(
        (transaction) =>
          transaction.id
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.nom_transaction
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.compte?.nom_compte
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          `${transaction.compte?.client?.prenom_client} ${transaction.compte?.client?.nom_client}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.type_transaction
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredTransactions(filtered);
    } else if (data?.data) {
      setFilteredTransactions(data.data);
    }
  }, [searchTerm, data]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setTransactionToDelete(null);
    }, 300);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;

    try {
      const response = await deleteTransaction(transactionToDelete.id);

      if (!isErrorDelete) {
        toast.success("Transaction supprimée avec succès !", {
          theme: "colored",
        });
      } else {
        toast.error("Erreur lors de la suppression !", { theme: "colored" });
      }

      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression !", { theme: "colored" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifié";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Fonction pour formater le montant
  const formatMontant = (montant, type) => {
    const montantNumber = parseFloat(montant);
    const formatted = new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(montantNumber);

    return `${formatted} Ar`;
  };

  // Fonction pour obtenir la couleur et l'icône selon le type de transaction
  const getTransactionTypeInfo = (type) => {
    switch (type?.toUpperCase()) {
      case "DEPOT":
        return {
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          icon: ArrowUpIcon,
          label: "Dépôt",
        };
      case "RETRAIT":
        return {
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          icon: ArrowDownIcon,
          label: "Retrait",
        };
      case "TRANSFERT":
        return {
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          icon: LandmarkIcon,
          label: "Transfert",
        };
      default:
        return {
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-900/30",
          icon: LandmarkIcon,
          label: type || "Inconnu",
        };
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
                  Êtes-vous sûr de vouloir supprimer la transaction :
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {transactionToDelete?.nom_transaction}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Montant:{" "}
                  {formatMontant(
                    transactionToDelete?.montant_transaction,
                    transactionToDelete?.type_transaction
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Date: {formatDate(transactionToDelete?.date_transaction)}
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
          <LandmarkIcon size={32} />
          <h1 className="text-2xl font-semibold">Les transactions</h1>
        </div>
      </div>

      {/* Barre de recherche et bouton d'ajout */}
      <div className="w-full flex justify-between items-center gap-4 px-5">
        {/* Champ de recherche à gauche */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-blue-600" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une transaction..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
          />
        </div>

        {/* Bouton d'ajout à droite */}
        <Link
          to={"/compte/admin/transactions/add"}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          <PlusIcon size={20} />
          <span>Nouvelle transaction</span>
        </Link>
      </div>

      <div className="w-full flex justify-start items-start overflow-x-auto">
        <div className="shrink-0 grow">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-blue-600 dark:text-blue-400 text-lg">
                Erreur de chargement des transactions !
              </p>
            </div>
          ) : (
            <table className="w-full border-separate border-spacing-y-2 shrink-0 text-left text-sm text-gray-700 dark:text-gray-200">
              <thead>
                <tr className="bg-gray-1000/25">
                  <th className="p-3 rounded-tl-lg rounded-bl-lg">#ID</th>
                  <th className="p-3">Compte</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Montant</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 rounded-tr-lg rounded-br-lg">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions?.map((transaction) => {
                  const TypeIcon = getTransactionTypeInfo(
                    transaction.type_transaction
                  ).icon;
                  const typeColor = getTransactionTypeInfo(
                    transaction.type_transaction
                  ).color;
                  const typeBgColor = getTransactionTypeInfo(
                    transaction.type_transaction
                  ).bgColor;

                  return (
                    <tr
                      key={transaction.id}
                      className="bg-gray-50 dark:bg-gray-800 hover:shadow-sm transition-all hover:duration-300 hover:bg-gray-100 dark:hover:bg-blue-900/20"
                    >
                      <td className="h-12 px-3 rounded-tl-lg rounded-bl-lg border-t-2 border-b-2 border-blue-300/15 border-l-2 font-medium">
                        {transaction.id}
                      </td>
                      <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {transaction.compte?.nom_compte}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.description_transaction}
                          </span>
                        </div>
                      </td>
                      <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                        <div
                          className={`flex items-center gap-2 px-2 py-1 rounded-full ${typeBgColor} w-fit`}
                        >
                          <TypeIcon className={`h-4 w-4 ${typeColor}`} />
                          <span className={`text-xs font-medium ${typeColor}`}>
                            {
                              getTransactionTypeInfo(
                                transaction.type_transaction
                              ).label
                            }
                          </span>
                        </div>
                      </td>
                      <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                        {transaction.compte?.client
                          ? `${transaction.compte.client.prenom_client} ${transaction.compte.client.nom_client}`
                          : "N/A"}
                      </td>
                      <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                        <span
                          className={`font-bold ${
                            transaction.type_transaction?.toUpperCase() ===
                            "DEPOT"
                              ? "text-green-600 dark:text-green-400"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          {formatMontant(
                            transaction.montant_transaction,
                            transaction.type_transaction
                          )}
                        </span>
                      </td>
                      <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <span>
                            {formatDate(transaction.date_transaction)}
                          </span>
                        </div>
                      </td>
                      <td className="h-12 px-3 border-t-2 border-b-2 rounded-tr-lg rounded-br-lg border-2 border-blue-300/15 flex justify-center items-center gap-2">
                        <button
                          className="cursor-pointer text-blue-600 hover:text-blue-700 transition-colors duration-200"
                          onClick={() =>
                            navigate(
                              "/compte/admin/transactions/" + transaction.id
                            )
                          }
                        >
                          <EyeIcon size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredTransactions?.length === 0 && searchTerm && (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <SearchIcon className="h-8 w-8 text-gray-400" />
                        <p>Aucune transaction trouvée pour "{searchTerm}"</p>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredTransactions?.length === 0 && !searchTerm && (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-8 text-gray-500 dark:text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <LandmarkIcon className="h-8 w-8 text-gray-400" />
                        <p>Aucune transaction disponible</p>
                        <Link
                          to="/compte/admin/transactions/add"
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Créer la première transaction
                        </Link>
                      </div>
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
