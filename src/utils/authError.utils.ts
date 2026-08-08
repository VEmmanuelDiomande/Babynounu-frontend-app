import type { INPUT_ERROR } from '@/types/auth.types';

/**
 * Extrait un message d'erreur explicite d'une réponse d'erreur axios
 * vers les endpoints d'authentification (sign-in, sign-up).
 *
 * Gère :
 * - Les erreurs de validation NestJS (400) : tableau [{ path, message }]
 * - Les erreurs métier (400/401) : message string
 * - Le rate limiting (429)
 * - Les erreurs serveur (500+)
 * - Les erreurs réseau (pas de response)
 */
export function parseAuthError(error: any): INPUT_ERROR {
  // ── Erreur réseau : aucune response axios ──
  if (!error?.response) {
    if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      return {
        path: '',
        message: 'La requête a expiré. Vérifiez votre connexion et réessayez.',
      };
    }
    return {
      path: '',
      message: 'Impossible de contacter le serveur. Vérifiez votre connexion internet et réessayez.',
    };
  }

  const { status, data } = error.response;

  // ── Rate limiting (429) ──
  if (status === 429) {
    return {
      path: '',
      message: 'Trop de tentatives. Veuillez patienter quelques instants avant de réessayer.',
    };
  }

  // ── Erreur serveur (500+) ──
  if (status >= 500) {
    return {
      path: '',
      message: 'Une erreur est survenue côté serveur. Veuillez réessayer dans quelques instants.',
    };
  }

  // ── Erreurs 400 / 401 ──
  const rawMessage = data?.message;

  // Validation NestJS : tableau de { path, message }
  if (Array.isArray(rawMessage) && rawMessage.length > 0) {
    // Retourner la première erreur de validation avec son path
    const first = rawMessage[0];
    if (first?.path && first?.message) {
      return {
        path: first.path,
        message: first.message,
      };
    }
    // Fallback : joindre tous les messages
    const joined = rawMessage
      .map((e: any) => (typeof e === 'string' ? e : e?.message || ''))
      .filter(Boolean)
      .join(', ');
    return {
      path: '',
      message: joined || 'Les données saisies sont invalides.',
    };
  }

  // Message string simple (ex: "Cet email est déjà utilisé", "Email ou mot de passe incorrect")
  if (typeof rawMessage === 'string' && rawMessage) {
    return {
      path: status === 401 ? '' : 'email',
      message: rawMessage,
    };
  }

  // Fallback générique selon le status
  if (status === 401) {
    return {
      path: '',
      message: 'Email ou mot de passe incorrect.',
    };
  }

  if (status === 400) {
    return {
      path: '',
      message: 'Les données saisies sont invalides. Veuillez vérifier vos informations.',
    };
  }

  return {
    path: '',
    message: 'Une erreur inattendue est survenue. Veuillez réessayer.',
  };
}
