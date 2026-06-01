import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const http = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.detail || error.message;
  }
  return "Unexpected network error";
};