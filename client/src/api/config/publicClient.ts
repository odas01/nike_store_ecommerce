import axios from 'axios';

const publicClient = axios.create({
   baseURL: import.meta.env.VITE_APP_API,
});

console.log(import.meta.env.VITE_APP_API);

publicClient.interceptors.request.use((config) => {
   return config;
});

publicClient.interceptors.response.use(
   (response) => response,
   (err) => {
      throw err.response.data;
   }
);

export { publicClient };
