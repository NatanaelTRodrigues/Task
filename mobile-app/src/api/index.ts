import axios from "axios"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; 

export const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;

