// src/utils/helpers.ts

import { StorageUtils } from "./store.utils";
import { buildImageUrl } from "./media.utils";

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
   * @param currency - Devise (FCFA par défaut)
   * @returns Montant formaté
   */
  export const formatCurrency = (amount: number, currency: string = 'FCFA'): string => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0
    }).format(amount) + ' ' + currency;
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
      draft: { color: 'medium', icon: 'paragraph', label: 'Brouillon' },
      pending: { color: 'warning', icon: 'timer-line', label: 'En attente' },
      active: { color: 'success', icon: 'checkbox-circle-line', label: 'Actif' },
      terminated: { color: 'danger', icon: 'close-line', label: 'Résilié' },
      cancelled: { color: 'dark', icon: 'forbid-line', label: 'Annulé' }
    };
  
    return statusMap[status] || { color: 'primary', icon: 'question-line', label: 'Inconnu' };
  };

/**
 * Parse une chaîne de références (JSON ou texte) en tableau d'objets.
 * Accepte un JSON stringifié ou un tableau d'objets. Retourne un tableau vide en cas d'erreur.
 *
 * @param value - Valeur des références (JSON, texte, etc.)
 * @returns Tableau de références { fullname, phone, ... }
 */
export const parseReferences = (value: any): Array<{ fullname?: string; phone?: string; [key: string]: any }> => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // fallback: traiter comme texte brut
      }
    }
    return [];
  }
  return [];
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

  /**
   * Construit une URL d'image complète à partir d'un chemin potentiellement relatif
   * @deprecated Utiliser buildImageUrl depuis @/utils/media.utils
   * @param url - URL ou chemin de l'image (ex: /uploads/profiles/photo.jpg)
   * @param fallback - URL de fallback si l'image est vide (défaut: /assets/default-avatar.png)
   * @returns URL complète pointant vers le backend
   */
  export const getImageUrl = (url?: string | null, fallback: string = '/assets/default-avatar.png'): string => {
    return buildImageUrl(url, fallback);
  };