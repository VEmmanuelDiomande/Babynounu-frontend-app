// Suggested code may be subject to a license. Learn more: ~LicenseLog:1864658494.
import axios from "axios";

export const ApiServices = () => {
  /**
   * Sends a GET request to the specified URL.
   *
   * @param {string} url - The URL to send the GET request to.
   * @return {Promise<Response>} A Promise that resolves to the Response object of the GET request.
   */
  const get = (url: string) => {
    return axios.get(url);
  };

  /**
   * Sends a POST request to the specified URL.
   *
   * @param {string} url - The URL to send the POST request to.
   * @param {any} data - The data to be sent in the request body.
   * @return {Promise<Response>} A Promise that resolves to the Response object of the POST request.
   */
  const post = (url: string, data: any) => {
    return axios.post(url, data)
  };

  /**
   * Sends a PUT request to the specified URL with the given data.
   *
   * @param {string} url - The URL to send the PUT request to.
   * @param {any} data - The data to be sent in the request body.
   * @return {Promise<Response>} A Promise that resolves to the Response object of the PUT request.
   */
  const put = async (url: string, data: any): Promise<Response> => {
    return await axios.put(url, data);
  };

  /**
   * Sends a DELETE request to the specified URL.
   *
   * @param {string} url - The URL to send the DELETE request to.
   * @return {Promise<Response>} A Promise that resolves to the Response object of the DELETE request.
   */
  const del = async (url: string): Promise<Response> => {
    return await axios.delete(url);
  };

  /**
   * Sends a PATCH request to the specified URL with the given data.
   *
   * @param {string} url - The URL to send the PATCH request to.
   * @param {any} data - The data to be sent in the request body.
   * @return {Promise<Response>} A Promise that resolves to the Response object of the PATCH request.
   */
  const patch = async (url: string, data: any): Promise<Response> => {
    return await axios.patch(url, data);
  };

  /**
   * Uploads data to a specified URL.
   *
   * @param {string} url - The URL to upload the data to.
   * @param {any} data - The data to be uploaded.
   * @return {Promise<Response>} A Promise that resolves to the Response object of the upload request.
   */
  const upload = async (url: string, data: any): Promise<Response> => {
    return await axios.post(url, data);
  };

  const download = async (url: string) => {
    return await axios.get(url, { responseType: "blob" });
  };

  return {
    FindAllService: get,
    CreateService: post,
    UpdateService: put,
    DeleteService: del,
    PatchService: patch,
    UploadService: upload,
    DownloadService: download,
  };
};
