export interface NotificationProfile {
  id: number;
  fullname: string;
  [key: string]: any;
}

export interface NotificationPhoto {
  originalUrl: string;
  [key: string]: any;
}

export interface Notification {
  id: number;
  type: string;
  title?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  profil: NotificationProfile;
  photo: NotificationPhoto;
  tolinkId?: number;
}

export type NotificationType = 'JOBS' | 'CANDIDATURE' | 'ABONNEMENT' | 'PAIEMENT' | 'CONTRAT' | 'PROPOSITION' | 'MESSAGE' | 'CERTIFICATION' | 'RESTRICTION' | string;
