// src/utils/helpers.ts

import { StorageUtils } from "./store.utils";

/**
 * Retarde l'exécution d'une promesse
 * @param ms - Temps en millisecondes
 * @returns Une promesse qui se résout après le délai
 */
export const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  /**
   * Formate une date au format local
   * @param dateString - Date au format ISO ou compatible
   * @returns Date formatée selon la locale
   */
  export const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  /**
   * Formate une date avec l'heure
   * @param dateString - Date au format ISO ou compatible
   * @returns Date et heure formatées selon la locale
   */
  export const formatDateTime = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  /**
   * Formate un montant monétaire
   * @param amount - Montant à formater
   * @param currency - Devise (EUR par défaut)
   * @returns Montant formaté
   */
  export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  /**
   * Gère les erreurs d'API de manière standardisée
   * @param error - Erreur à traiter
   * @returns Message d'erreur lisible
   */
  export const handleApiError = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Une erreur inconnue est survenue';
  };
  
  /**
   * Valide un numéro de téléphone français
   * @param phone - Numéro à valider
   * @returns Booléen indiquant si le numéro est valide
   */
  export const validateFrenchPhone = (phone: string): boolean => {
    const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return regex.test(phone);
  };
  
  /**
   * Génère un identifiant unique
   * @returns Un UUID v4
   */
  export const generateId = (): string => {
    return crypto.randomUUID();
  };
  
  /**
   * Simplifie la gestion des dates pour les contrats
   * @param days - Nombre de jours à ajouter (par défaut 0)
   * @returns Date au format ISO sans l'heure
   */
  export const getContractDate = (days: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };
  
  /**
   * Fonction utilitaire pour les status de contrat
   * @param status - Statut du contrat
   * @returns Configuration UI pour le statut
   */
  export const getContractStatusConfig = (status: string) => {
    const statusMap: Record<string, { color: string; icon: string; label: string }> = {
      draft: { color: 'medium', icon: 'document-text-outline', label: 'Brouillon' },
      pending: { color: 'warning', icon: 'time-outline', label: 'En attente' },
      active: { color: 'success', icon: 'checkmark-circle-outline', label: 'Actif' },
      terminated: { color: 'danger', icon: 'close-circle-outline', label: 'Résilié' },
      cancelled: { color: 'dark', icon: 'ban-outline', label: 'Annulé' }
    };
  
    return statusMap[status] || { color: 'primary', icon: 'help-circle-outline', label: 'Inconnu' };
  };

  /**
 * Récupère l'ID utilisateur depuis le stockage
 */
export const getUserId = async (): Promise<string | null> => {
  try {
    const result = await StorageUtils().getStore("nUser_Id");
    return result.value;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'ID utilisateur:", error);
    return null;
  }
};
  
  /**
   * Tronque un texte avec une ellipse si nécessaire
   * @param text - Texte à tronquer
   * @param length - Longueur maximale
   * @returns Texte tronqué si nécessaire
   */
  export const truncateText = (text: string, length: number = 100): string => {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };