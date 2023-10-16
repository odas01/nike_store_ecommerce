import axios from 'axios';
const axiosApi = axios.create({
   baseURL: 'https://provinces.open-api.vn/api/',
});

export const addressApi = {
   getProvinces: async () => (await axiosApi.get('/')).data,
   getDistricts: async (code: string) =>
      (await axiosApi.get('/p/' + code + '?depth=2')).data,
   getWards: async (code: string) =>
      (await axiosApi.get('/d/' + code + '?depth=2')).data,
};
