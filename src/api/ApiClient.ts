import axios from 'axios';

const apiClient = axios.create({
    baseURL: "https://app-api-epdservice-dev.azurewebsites.net",
    timeout: 5000
});

apiClient.interceptors.request.use(request => {
    return new Promise(function (resolve /*, reject*/) {
      const token = localStorage.getItem('carbon0.accessToken');

      if (token && request.headers) {
        request.headers = {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          //AccessToken: token,
          "x-query-options" : `${request.headers["x-query-options"] ?request.headers["x-query-options"] : 'includeDisabled=true,includeDeleted=false'}`,
        }
      }
      resolve(request);
    });
  });


export default apiClient;
