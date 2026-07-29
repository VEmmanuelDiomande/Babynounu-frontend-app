import { Capacitor } from '@capacitor/core';
import { REDIRECT_PAYMENT_URL } from '@/routes/_requests/index.request';

const APP_DEEP_LINK_SCHEME = 'babynounu';

export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = (): string => {
  return Capacitor.getPlatform();
};

export const getPaymentReturnUrl = (): string => {
  if (isNativePlatform()) {
    return `${APP_DEEP_LINK_SCHEME}://payment/return`;
  }
  return `${REDIRECT_PAYMENT_URL}/payment/return`;
};

export const getDeepLinkReturnUrl = (): string => {
  return `${APP_DEEP_LINK_SCHEME}://payment/return`;
};
