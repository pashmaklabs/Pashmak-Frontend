import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = "https://example.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("توکن منقضی شده است، کاربر به صفحه ورود هدایت شد.");
      localStorage.removeItem("jwtToken"); 
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;


const postRequest = async ({ url, data, queryParams }) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url; 

  const response = await apiClient.post(fullUrl, data); 
  return response.data; 
};

export const usePostRequest = () => {
  return useMutation({
    mutationFn: postRequest, 
  });
};
