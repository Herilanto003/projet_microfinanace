import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";
import { toast } from "react-toastify";
import {
  Users2Icon,
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  UserPlusIcon,
  UserMinusIcon,
  ShieldIcon,
  UserIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { setTitleHeader } from "../../redux/features/titleHeaderSlice";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useDeleteUserMutation,
} from "../../redux/api/userApi";
import BaseModal from "../../components/common/BaseModal";

export default function UserPage() {
  const dispatch = useDispatch();
  const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [activateUser] = useActivateUserMutation();
  const [deactivateUser] = useDeactivateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  useEffect(() => {
    dispatch(setTitleHeader({ title: "Utilisateurs" }));
  }, [dispatch]);

  useEffect(() => {
    if (users && searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else if (users) {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      await addUser(form).unwrap();
      setShowAddModal(false);
      setForm({ name: "", email: "", password: "", role: "client" });
      refetch();
      toast.success("Utilisateur ajouté avec succès !", { theme: "colored" });
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'utilisateur !", {
        theme: "colored",
      });
    }
    setLoadingAction(false);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setUserToDelete(null);
    }, 300);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setLoadingAction(true);
    try {
      await deleteUser(userToDelete.id).unwrap();
      toast.success("Utilisateur supprimé avec succès !", { theme: "colored" });
      handleCloseModal();
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la suppression !", { theme: "colored" });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleActivate = async (id) => {
    setLoadingAction(true);
    try {
      await activateUser(id).unwrap();
      toast.success("Utilisateur activé avec succès !", { theme: "colored" });
      refetch();
    } catch (error) {
      toast.error("Erreur lors de l'activation !", { theme: "colored" });
    }
    setLoadingAction(false);
  };

  const handleDeactivate = async (id) => {
    setLoadingAction(true);
    try {
      await deactivateUser(id).unwrap();
      toast.success("Utilisateur désactivé avec succès !", {
        theme: "colored",
      });
      refetch();
    } catch (error) {
      toast.error("Erreur lors de la désactivation !", { theme: "colored" });
    }
    setLoadingAction(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <ShieldIcon size={16} className="text-purple-600" />;
      default:
        return <UserIcon size={16} className="text-blue-600" />;
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
                  Êtes-vous sûr de vouloir supprimer l'utilisateur :
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {userToDelete?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {userToDelete?.email}
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
                  disabled={loadingAction}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={loadingAction}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                >
                  {loadingAction ? (
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

      {/* En-tête de la page */}
      <div className="w-full flex justify-between items-center gap-5 text-4xl border-b border-b-gray-500 pb-5 px-5 text-gray-800 dark:text-gray-200 dark:border-b-gray-200">
        <div className="flex items-center gap-4">
          <Users2Icon size={32} />
          <h1 className="text-2xl font-semibold">Gestion des utilisateurs</h1>
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
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
          />
        </div>

        {/* Bouton d'ajout à droite */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon size={20} />
          <span>Ajouter un utilisateur</span>
        </button>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="w-full flex justify-start items-start overflow-x-auto">
        <div className="shrink-0 grow">
          {isLoading ? (
            <p className="text-gray-700 dark:text-gray-200 px-5">
              Chargement...
            </p>
          ) : isError ? (
            <p className="text-blue-600 dark:text-blue-400 px-5">
              Erreur de serveur !
            </p>
          ) : (
            <table className="w-full border-separate border-spacing-y-2 shrink-0 text-left text-sm text-gray-700 dark:text-gray-200">
              <thead>
                <tr className="bg-gray-1000/25">
                  <th className="p-3 rounded-tl-lg rounded-bl-lg">#ID</th>
                  <th className="p-3">Nom</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Rôle</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3 rounded-tr-lg rounded-br-lg">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers?.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-gray-50 dark:bg-gray-800 hover:shadow-sm transition-all hover:duration-300 hover:bg-gray-100 dark:hover:bg-blue-900/20"
                  >
                    <td className="h-12 px-3 rounded-tl-lg rounded-bl-lg border-t-2 border-b-2 border-blue-300/15 border-l-2">
                      {user.id}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      {user.name}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      {user.email}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 border-blue-300/15">
                      {user.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="h-12 px-3 border-t-2 border-b-2 rounded-tr-lg rounded-br-lg border-2 border-blue-300/15">
                      <div className="flex justify-center items-center gap-2">
                        {user.is_active ? (
                          <button
                            className="cursor-pointer text-yellow-500 hover:text-yellow-700 transition-colors duration-200 p-1 rounded hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                            onClick={() => handleDeactivate(user.id)}
                            disabled={loadingAction}
                            title="Désactiver"
                          >
                            <UserMinusIcon size={16} />
                          </button>
                        ) : (
                          <button
                            className="cursor-pointer text-green-500 hover:text-green-700 transition-colors duration-200 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                            onClick={() => handleActivate(user.id)}
                            disabled={loadingAction}
                            title="Activer"
                          >
                            <UserPlusIcon size={16} />
                          </button>
                        )}
                        <button
                          className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          onClick={() => handleDeleteClick(user)}
                          disabled={loadingAction}
                          title="Supprimer"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredUsers?.length === 0 && searchTerm && (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4 text-gray-500 dark:text-gray-400"
                    >
                      Aucun utilisateur trouvé pour "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal d'ajout d'utilisateur */}
      <BaseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Ajouter un utilisateur"
        variant="add"
      >
        <form onSubmit={handleAddUser} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nom
            </label>
            <input
              type="text"
              placeholder="Nom complet"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="adresse@email.com"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Rôle
            </label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="client">Client</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              onClick={() => setShowAddModal(false)}
              disabled={loadingAction}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loadingAction}
            >
              {loadingAction ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                <>
                  <UserPlusIcon size={16} />
                  Ajouter l'utilisateur
                </>
              )}
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}
