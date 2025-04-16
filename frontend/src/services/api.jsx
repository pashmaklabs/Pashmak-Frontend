import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

const API_BASE_URL = "https://pashmak-api.darkube.app";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

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


const getRequest = async ({ url, queryParams }) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  console.log("Sending GET request to:", fullUrl); // Debugging
  try {
    const response = await apiClient.get(fullUrl);
    console.log("GET Request succeeded:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("GET Request failed:", error); // Debugging
    throw error;
  }
};

export const useGetRequest = (queryKey, queryParams) => {
  return useQuery({
    queryKey: [queryKey, queryParams], // Unique key for caching
    queryFn: () => getRequest(queryParams),
  });
};


const patchRequest = async ({ url, data, queryParams }) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  console.log("Sending PATCH request to:", fullUrl, "with data:", data); // Debugging
  try {
    const response = await apiClient.patch(fullUrl, data);
    console.log("PATCH request succeeded:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("PATCH request failed:", error); // Debugging
    throw error;
  }
};

export const usePatchRequest = () => {
  return useMutation({
    mutationFn: patchRequest,
  });
};
