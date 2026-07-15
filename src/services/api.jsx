import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";

//const API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default apiClient;

const postRequest = async ({ url, data, queryParams, headers }) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  // console.log("Sending request to:", fullUrl, "with data:", data); // Debugging
  try {
    const response = await apiClient.post(fullUrl, data, {
      headers: headers || {},
    });
    // console.log("Request succeeded:", response.data); // Debugging
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

const getRequest = async ({ endpoint, params }) => {
  // const queryString = new URLSearchParams(params).toString();
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const fullUrl = queryString ? `${endpoint}?${queryString}` : endpoint;
  const response = await apiClient.get(fullUrl);
  return response.data;
};

export const useGetRequest = () => {
  return useMutation({
    mutationFn: ({ endpoint, params }) => getRequest({ endpoint, params }),
  });
};

const patchRequest = async ({ url, data, queryParams }) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  // console.log("Sending PATCH request to:", fullUrl, "with data:", data); // Debugging
  try {
    const response = await apiClient.patch(fullUrl, data);
    // console.log("PATCH request succeeded:", response.data); // Debugging
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

const deleteRequest = async ({ url, queryParams }) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  try {
    const response = await apiClient.delete(fullUrl);
    return response.data;
  } catch (error) {
    console.error("DELETE request failed:", error);
    throw error;
  }
};

export const useDeleteRequest = () => {
  return useMutation({
    mutationFn: deleteRequest,
  });
};
