import axios from 'axios';

const axiosClient = axios.create({
  baseURL: "http://localhost:8081/api",
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
    if (error.response) {
      // Sunucudan gelen hata
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // İstek gitti ama cevap gelmedi
      return Promise.reject("No response from server");
    } else {
      // İstek ayarı sırasında hata oluştu
      return Promise.reject(error.message || "Unexpected error");
    }
  }
);

export default axiosClient;
