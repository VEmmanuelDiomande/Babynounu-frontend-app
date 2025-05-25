import { ApiServices } from "./api.services";

const AppService = () => {
  const { FindAllService } = ApiServices();

  /**
   * Function to set and retrieve service data for all items.
   *
   * @param {string} URL_API - The API URL for finding all items.
   * @return {Promise<void>} A promise that resolves with the response JSON.
   */
  const setServiceFindAll = async (URL_API: string, callback: Function) => {
    try {
      const  json  = await FindAllService(URL_API);

      if (json) {
        callback(json);
      }
    } catch (error) {
        
    }
  };
};
