import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const API_BASE_URL = "https://fdz4c0xg-8080.uks1.devtunnels.ms";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
    console.log("response header is : ", response.headers);
    const authHeader = response.headers["Authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      localStorage.setItem("jwtToken", token);
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
  console.log("Sending request to:", fullUrl, "with data:", data); // Debugging
  try {
    const response = await apiClient.post(fullUrl, data);
    console.log("Request succeeded:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Request failed:", error); // Debugging
    throw error;
  }
};

export const usePostRequest = () => {
  return useMutation({
    mutationFn: postRequest,
  });
};

export const removeJwtToken = () => {
  localStorage.removeItem("jwtToken");
};
