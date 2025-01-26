import { StorageUtils } from "@/utils/store.utils";

export const globalFetch = async (
  url: string,
  options: RequestInit = {},
  includeAuth: boolean = true
) => {
  try {
    // Récupérer le token d'autorisation si nécessaire
    const token = includeAuth ? (await StorageUtils().getStore("nToken")).value : null;
    console.log(token)
    // Configurer les en-têtes par défaut
    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Fusionner les options passées avec les options par défaut
    const finalOptions: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    };

    // Effectuer la requête
    const response = await fetch(url, finalOptions);

    // Vérification du statut HTTP
    if (!response.ok) {
      throw new Error(
        `HTTP Error: ${response.status} - ${response.statusText}`
      );
    }

    // Retourner les données JSON
    return await response.json();
  } catch (error) {
    console.error("Global fetch error:", error);
    throw error; // Propager l'erreur pour la gérer plus haut
  }
};
