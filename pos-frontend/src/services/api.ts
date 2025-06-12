import axios from 'axios';
import { Product, ApiResponse } from '../types/product';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    return response.data.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  create: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
    const response = await api.post<ApiResponse<Product>>('/products', product);
    return response.data.data;
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, product);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};