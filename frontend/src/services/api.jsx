import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = "https://m67tf2bg-8080.euw.devtunnels.ms";

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
  },
);

apiClient.interceptors.response.use(
  (response) => {
    // Check if the response contains a JWT token and save it
    if (response.data?.token) {
      localStorage.setItem("jwtToken", response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("توکن منقضی شده است، کاربر به صفحه ورود هدایت شد.");
      localStorage.removeItem("jwtToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;

const postRequest = async ({ url, data, queryParams }) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  console.log(data);
  const response = await apiClient.post(fullUrl, data);
  return response.data;
};

export const usePostRequest = () => {
  return useMutation({
    mutationFn: postRequest,
  });
};

export const removeJwtToken = () => {
  localStorage.removeItem("jwtToken");
};
