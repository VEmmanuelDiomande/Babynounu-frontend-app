import { StorageUtils } from '@/utils/store.utils';
import axios from 'axios';

export const authentificateApp = async () => {
   // Verify is Token exist
   const nToken = await StorageUtils().getStore('nToken');
   const TOKEN = nToken.value ? nToken.value : null;

   if (TOKEN) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + TOKEN;
   }

   return {TOKEN}
};
