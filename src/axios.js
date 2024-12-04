import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ipgrupa4echipa1-b4acchb9bfcnfzfc.northeurope-01.azurewebsites.net/', // Replace with your API's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
