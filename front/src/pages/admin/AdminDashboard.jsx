import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  UserX,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
} from "lucide-react";

import {
  useGetAdminStatsQuery,
  useGetAdminTransactionsQuery,
  useGetPretsChartQuery,
  useGetClientsChartQuery,
  useGetEvolutionQuery,
} from "../../redux/api";

const AdminDashboard = () => {
  // Requête API pour les statistiques
  const { data: statsApiData, isLoading: statsLoading } =
    useGetAdminStatsQuery();
  const statsData = statsApiData || null;

  const [transactionFilters, setTransactionFilters] = useState({
    dateDebut: "",
    dateFin: "",
    compte: "",
    action: "",
  });

  const [userActionFilters, setUserActionFilters] = useState({
    dateDebut: "",
    dateFin: "",
    action: "",
  });

  // Transactions via API (les filtres sont gérés localement et envoyés à l'API)
  const { data: transactionsApiData, isLoading: transactionsLoading } =
    useGetAdminTransactionsQuery({
      start: transactionFilters.dateDebut || undefined,
      end: transactionFilters.dateFin || undefined,
      compte: transactionFilters.compte || undefined,
      action: transactionFilters.action || undefined,
    });
  const transactionsData = transactionsApiData || [];

  // Données des actions utilisateurs
  const userActionsData = [
    {
      id: 1,
      date: "2025-10-20",
      utilisateur: "Admin",
      action: "Création",
      cible: "Client #1247",
      details: "Nouveau client créé",
    },
    {
      id: 2,
      date: "2025-10-21",
      utilisateur: "Manager",
      action: "Modification",
      cible: "Prêt #342",
      details: "Montant modifié",
    },
    {
      id: 3,
      date: "2025-10-22",
      utilisateur: "Admin",
      action: "Désactivation",
      cible: "Utilisateur #45",
      details: "Compte désactivé",
    },
    {
      id: 4,
      date: "2025-10-23",
      utilisateur: "Agent",
      action: "Création",
      cible: "Transaction #8923",
      details: "Nouvelle transaction",
    },
    {
      id: 5,
      date: "2025-10-24",
      utilisateur: "Admin",
      action: "Suppression",
      cible: "Client #1089",
      details: "Client supprimé",
    },
    {
      id: 6,
      date: "2025-10-25",
      utilisateur: "Manager",
      action: "Activation",
      cible: "Utilisateur #52",
      details: "Compte réactivé",
    },
    {
      id: 7,
      date: "2025-10-26",
      utilisateur: "Admin",
      action: "Modification",
      cible: "Prêt #340",
      details: "Taux d'intérêt ajusté",
    },
  ];

  // Données pour les graphiques depuis l'API
  const { data: pretsChartApi, isLoading: pretsLoading } =
    useGetPretsChartQuery();
  const { data: clientsChartApi, isLoading: clientsLoading } =
    useGetClientsChartQuery();
  const { data: evolutionApi, isLoading: evolutionLoading } =
    useGetEvolutionQuery();

  const pretsChartData = pretsChartApi || null;
  const clientsChartData = clientsChartApi || null;
  const evolutionData = evolutionApi || null;

  // Les transactions sont déjà filtrées par l'API, pas besoin de filtrage local
  const filteredTransactions = transactionsData;

  // Filtrage des actions utilisateurs
  const filteredUserActions = useMemo(() => {
    return userActionsData.filter((a) => {
      const dateMatch =
        (!userActionFilters.dateDebut ||
          a.date >= userActionFilters.dateDebut) &&
        (!userActionFilters.dateFin || a.date <= userActionFilters.dateFin);
      const actionMatch =
        !userActionFilters.action || a.action === userActionFilters.action;
      return dateMatch && actionMatch;
    });
  }, [userActionFilters]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color,
    loading,
  }) => (
    <div
      className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : value !== null && value !== undefined ? (
              value.toLocaleString()
            ) : (
              "—"
            )}
          </p>
          {!loading && trend && (
            <div className="flex items-center mt-2">
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-blue-500 mr-1" />
              )}
              <span
                className={`text-sm ${
                  trend === "up" ? "text-green-500" : "text-blue-500"
                }`}
              >
                {trendValue}%
              </span>
            </div>
          )}
        </div>
        <div
          className="p-3 rounded-full"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon className="w-8 h-8" style={{ color: color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Tableau de Bord
        </h1>

        {/* Statistiques Clients */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Statistiques Clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total des Clients"
              value={statsData?.totalClients}
              icon={Users}
              color="#10b981"
              trend="up"
              trendValue="12.5"
              loading={statsLoading}
            />
            <StatCard
              title="Clients Actifs"
              value={statsData?.clientsActifs}
              icon={Users}
              color="#22c55e"
              loading={statsLoading}
            />
            <StatCard
              title="Clients Supprimés"
              value={statsData?.clientsSupprimes}
              icon={UserX}
              color="#60a5fa"
              loading={statsLoading}
            />
          </div>
        </div>

        {/* Statistiques Prêts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Statistiques Prêts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Prêts en Cours"
              value={statsData?.pretsEnCours}
              icon={DollarSign}
              color="#10b981"
              loading={statsLoading}
            />
            <StatCard
              title="Prêts Payés"
              value={statsData?.pretsPayes}
              icon={DollarSign}
              color="#22c55e"
              trend="up"
              trendValue="8.3"
              loading={statsLoading}
            />
            <StatCard
              title="Prêts Impayés"
              value={statsData?.pretsImpayes}
              icon={DollarSign}
              color="#60a5fa"
              trend="down"
              trendValue="3.2"
              loading={statsLoading}
            />
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Répartition des Prêts
            </h3>
            {pretsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ) : pretsChartData ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pretsChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pretsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Répartition des Clients
            </h3>
            {clientsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ) : clientsChartData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {clientsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-gray-500">
                Aucune donnée disponible
              </div>
            )}
          </div>
        </div>

        {/* Évolution des Transactions */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Évolution des Transactions
          </h3>
          {evolutionLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ) : evolutionData ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mois" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="depots"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Dépôts"
                />
                <Line
                  type="monotone"
                  dataKey="retraits"
                  stroke="#60a5fa"
                  strokeWidth={2}
                  name="Retraits"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-sm text-gray-500">
              Aucune donnée disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
