// /lib/api.ts

import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const fetchCountries = () => api.get("/universal/countries");
export const fetchProfessions = () => api.get("/universal/professions");
export const registerUser = (data: any) => api.post("/auth/register", data);