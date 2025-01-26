import { Preferences } from '@capacitor/preferences';

export const StorageUtils = () => {
   // Get the specific data in localstorage
   const getStore = async (key: any) => {
      return await Preferences.get({
         key
      });
   };

   // Set the specific data in localstorage
   const setStore  = async (key: any, value: any) => {
      await Preferences.set({
         key,
         value,
      });
   };

   // Remove the specific data in localstorage
   const removeStore  = async (key: any) => {
      await Preferences.remove({
         key,
      });
   };

   // Remove the specific data in localstorage
   const clearStore  = async () => {
      await Preferences.clear();
   };

   return {
      getStore,
      setStore,
      removeStore,
      clearStore
   };
};
