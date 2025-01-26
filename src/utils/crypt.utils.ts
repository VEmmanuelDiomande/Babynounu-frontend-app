import CryptoJS from 'crypto-js';

export const CryptUtils = () => {
   const qCrypt = (message: any) => {
      return CryptoJS.AES.encrypt(message, 'likidonsCryptoByQe').toString();
   };
   // Decrypt
   const qDecrypted = (msgCrypto: any) => {
      const bytes = CryptoJS.AES.decrypt(msgCrypto, 'likidonsCryptoByQe');
      return bytes.toString(CryptoJS.enc.Utf8);
   };

   const qCryptJson = (message: any) => {
      return CryptoJS.AES.encrypt(
         JSON.stringify(message),
         'likidonsCryptoByQe'
      ).toString();
   };

   const qDecryptedJson = (msgCrypto: any) => {
      const decrypted = CryptoJS.AES.decrypt(msgCrypto, 'likidonsCryptoByQe');
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
