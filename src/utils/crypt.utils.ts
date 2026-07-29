import CryptoJS from 'crypto-js';

const CRYPTO_KEY = import.meta.env.VITE_CRYPTO_KEY || 'fallback-key-change-in-production';

export const CryptUtils = () => {
   const qCrypt = (message: any) => {
      return CryptoJS.AES.encrypt(message, CRYPTO_KEY).toString();
   };
   // Decrypt
   const qDecrypted = (msgCrypto: any) => {
      const bytes = CryptoJS.AES.decrypt(msgCrypto, CRYPTO_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
   };

   const qCryptJson = (message: any) => {
      return CryptoJS.AES.encrypt(
         JSON.stringify(message),
         CRYPTO_KEY
      ).toString();
   };

   const qDecryptedJson = (msgCrypto: any) => {
      const decrypted = CryptoJS.AES.decrypt(msgCrypto, CRYPTO_KEY);
      const bytes = CryptoJS.enc.Utf8.stringify(decrypted);
      return JSON.parse(bytes);
   };

   return {
      qCrypt,
      qDecrypted,
      qCryptJson,
      qDecryptedJson,
   };
};
