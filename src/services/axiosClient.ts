import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (Adding token)
axiosClient.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



// Response interceptor (error handling)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message;

    if (error.response) {
      message = error.response.data?.message || "Bir hata oluştu";
      return Promise.reject(error.response.data);
    } else if (error.request) {
      message = "Sunucuya ulaşılamıyor";
      return Promise.reject(message);
    } else {
      message = error.message || "Beklenmeyen bir hata";
      return Promise.reject(message);
    }
  }
);

export default axiosClient;
