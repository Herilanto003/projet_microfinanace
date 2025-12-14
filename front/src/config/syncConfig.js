/**
 * Configuration centralisée pour le système de synchronisation RTK Query
 * Défini les tags disponibles pour chaque API et leurs relations
 */

export const SYNC_CONFIG = {
  // Tags par API
  apis: {
    admin: {
      name: "adminApi",
      tags: ["Admin", "Transaction"],
      description: "API pour les statistiques et transactions admin",
    },
    client: {
      name: "clientApi",
      tags: ["Client"],
      description: "API pour la gestion des clients",
    },
    compte: {
      name: "compteApi",
      tags: ["Compte"],
      description: "API pour la gestion des comptes",
    },
    transaction: {
      name: "transactionApi",
      tags: ["Transaction", "Historique"],
      description: "API pour les transactions et historiques",
    },
    pret: {
      name: "pretApi",
      tags: ["Pret"],
      description: "API pour les prêts",
    },
    rembourse: {
      name: "rembourseApi",
      tags: ["Rembourse"],
      description: "API pour les remboursements",
    },
  },

  // Profils de synchronisation par rôle/dashboard
  profiles: {
    admin: {
      name: "Admin Dashboard",
      apis: ["admin", "transaction", "client", "compte", "pret", "rembourse"],
      description: "Synchronise tous les données du système",
    },
    caissier: {
      name: "Caissier Dashboard",
      apis: ["transaction", "compte", "client"],
      tags: ["Transaction", "Compte", "Historique", "Client"],
      description: "Synchronise les données pertinentes au caissier",
    },
    client: {
      name: "Client Dashboard",
      apis: ["compte", "transaction", "pret", "rembourse"],
      tags: ["Compte", "Transaction", "Historique", "Pret", "Rembourse"],
      description: "Synchronise les données pertinentes au client",
    },
  },

  // Événements qui doivent déclencher la synchronisation
  syncTriggers: {
    navigation: {
      enabled: true,
      description: "Synchroniser lors de la navigation vers un dashboard",
    },
    focusWindow: {
      enabled: false,
      description: "Synchroniser quand l'utilisateur revient à la fenêtre",
    },
    timedRefresh: {
      enabled: false,
      interval: 300000, // 5 minutes
      description: "Synchroniser automatiquement toutes les 5 minutes",
    },
    mutation: {
      enabled: true,
      description: "Les mutations invalident automatiquement les tags",
    },
  },
};

/**
 * Utility: Récupérer tous les tags pour une API
 */
export const getApiTags = (apiName) => {
  return SYNC_CONFIG.apis[apiName]?.tags || [];
};

/**
 * Utility: Récupérer tous les tags pour un profil
 */
export const getProfileTags = (profileName) => {
  const profile = SYNC_CONFIG.profiles[profileName];
  if (!profile) return [];

  if (profile.tags) {
    return profile.tags;
  }

  // Récupérer les tags des APIs du profil
  return profile.apis.reduce((acc, apiName) => {
    const tags = getApiTags(apiName);
    return [...new Set([...acc, ...tags])];
  }, []);
};

/**
 * Utility: Récupérer les APIs pour un profil
 */
export const getProfileApis = (profileName) => {
  const profile = SYNC_CONFIG.profiles[profileName];
  return profile?.apis || [];
};

export default SYNC_CONFIG;
