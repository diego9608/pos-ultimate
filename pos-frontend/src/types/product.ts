export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  category: string;
  active: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
  message?: string;
}