import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProducts = async () => await api.get("/products");
export const getProductById = async (id) => await api.get(`/products/${id}`);
export const registerUser = async (data) => await api.post("/register", data);
export const loginUser = async (data) => await api.post("/login", data);
export const placeOrder = async (data) => await api.post("/orders", data);

export default api;
