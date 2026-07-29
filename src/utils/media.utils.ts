import { BASE_URL_CENTER } from '@/routes/_requests/index.request';
import { Browser } from '@capacitor/browser';
import { isNativePlatform } from '@/utils/payment.utils';

/**
 * Construit une URL d'image complète à partir d'un chemin potentiellement relatif.
 * Gère les cas : URL absolue (http/https), chemin relatif (avec ou sans slash initial), null/undefined.
 *
 * @param url - URL ou chemin de l'image (ex: /uploads/photo.jpg)
 * @param fallback - URL de fallback si l'image est vide (défaut: '')
 * @returns URL complète pointant vers le backend
 */
export const buildImageUrl = (url?: string | null, fallback: string = ''): string => {
  if (!url) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BASE_URL_CENTER}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Extrait l'URL d'un objet média de l'API.
 * L'API peut renvoyer originalUrl, url ou path selon le contexte.
 *
 * @param media - Objet média (ex: { originalUrl, url, path, typeMedia: { slug } })
 * @param fallback - URL de fallback
 * @returns URL complète de l'image
 */
export const getMediaUrl = (media?: any | null, fallback: string = ''): string => {
  if (!media) return fallback;
  return buildImageUrl(media.originalUrl || media.url || media.path, fallback);
};

/**
 * Trouve un média par son type (slug du typeMedia).
 *
 * @param medias - Tableau de médias
 * @param slug - Slug du type de média (ex: 'photo_profil', 'photo_banniere')
 * @returns Le média trouvé ou undefined
 */
export const findMediaByType = (medias: any[] | null | undefined, slug: string): any | undefined => {
  if (!medias || !Array.isArray(medias)) return undefined;
  return medias.find((m: any) => {
    const mediaSlug = m.typeMedia?.slug || '';
    return mediaSlug === slug;
  });
};

/**
 * Récupère l'URL de la photo de profil depuis un tableau de médias.
 *
 * @param medias - Tableau de médias
 * @returns URL de la photo de profil ou chaîne vide
 */
export const getAvatarUrl = (medias: any[] | null | undefined): string => {
  if (!medias || !Array.isArray(medias) || medias.length === 0) return '';
  const photo = findMediaByType(medias, 'photo_profil') || findMediaByType(medias, 'profil');
  return getMediaUrl(photo || medias[0]);
};

/**
 * Récupère l'URL de la bannière depuis un tableau de médias.
 *
 * @param medias - Tableau de médias
 * @returns URL de la bannière ou chaîne vide
 */
export const getBannerUrl = (medias: any[] | null | undefined): string => {
  const banner = findMediaByType(medias, 'photo_banniere');
  return getMediaUrl(banner);
};

/**
 * Filtre les médias de galerie (type_galery).
 *
 * @param medias - Tableau de médias
 * @returns Tableau des médias de galerie
 */
export const getGalleryMedia = (medias: any[] | null | undefined): any[] => {
  if (!medias || !Array.isArray(medias)) return [];
  return medias.filter((m: any) => {
    const slug = m.typeMedia?.slug || '';
    return slug === 'type_galery';
  });
};

/**
 * Récupère les URLs des photos de galerie depuis un tableau de médias.
 *
 * @param medias - Tableau de médias
 * @returns Tableau d'URLs
 */
export const getGalleryUrls = (medias: any[] | null | undefined): string[] => {
  return getGalleryMedia(medias)
    .map((m: any) => getMediaUrl(m))
    .filter(Boolean);
};

/**
 * Détermine si un média est une image en fonction de son extension.
 *
 * @param media - Objet média
 * @returns true si le média est une image
 */
export const isImageMedia = (media: any): boolean => {
  const ext = (media.filename || media.originalName || media.path || '').split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext || '');
};

/**
 * Retourne la classe d'icône RemixIcon adaptée au type de média.
 *
 * @param media - Objet média
 * @returns Classe d'icône (ex: 'ri-image-line' ou 'ri-file-pdf-line')
 */
export const getMediaIcon = (media: any): string => {
  const ext = (media.filename || media.originalName || media.path || '').split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext || '')) return 'ri-image-line';
  if (ext === 'pdf') return 'ri-file-pdf-line';
  if (['doc', 'docx'].includes(ext || '')) return 'ri-file-word-line';
  if (['xls', 'xlsx', 'csv'].includes(ext || '')) return 'ri-file-excel-line';
  return 'ri-file-line';
};

/**
 * Ouvre un média (image, PDF, etc.) en adapté à la plateforme.
 * Sur mobile natif, utilise le navigateur in-app de Capacitor.
 * Sur le web, ouvre le lien dans un nouvel onglet.
 *
 * @param media - Objet média à ouvrir
 */
export const openMedia = async (media: any): Promise<void> => {
  const url = getMediaUrl(media);
  if (!url) return;
  await openMediaUrl(url);
};

/**
 * Ouvre une URL de média en adapté à la plateforme.
 *
 * @param url - URL complète du média
 */
export const openMediaUrl = async (url: string): Promise<void> => {
  if (!url) return;
  try {
    if (isNativePlatform()) {
      await Browser.open({ url, presentationStyle: 'fullscreen' });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ouverture du média:', error);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};
