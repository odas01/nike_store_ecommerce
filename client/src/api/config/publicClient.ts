import axios from 'axios';

const publicClient = axios.create({
   baseURL: 'https://mern-nikestore-api.vercel.app/api/',
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
