import { http } from "./api";
import type { PaginatedResponse, Product } from "./types";

export interface ProductCreatePayload {
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock_quantity: number;
}

export const fetchProducts = async (page = 1, limit = 20, search = "") => {
  const response = await http.get<PaginatedResponse<Product>>("/products", {
    params: { page, limit, search },
  });
  return response.data;
};

export const createProduct = async (payload: ProductCreatePayload) => {
  const response = await http.post<Product>("/products", payload);
  return response.data;
};

export const updateProduct = async (id: number, payload: Partial<ProductCreatePayload>) => {
  const response = await http.put<Product>(`/products/${id}`, payload);
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await http.delete<Product>(`/products/${id}`);
  return response.data;
};
