import { http } from "./api";
import type { PaginatedResponse, Customer } from "./types";

export interface CustomerCreatePayload {
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
}

export const fetchCustomers = async (page = 1, limit = 20, search = "") => {
  const response = await http.get<PaginatedResponse<Customer>>("/customers", {
    params: { page, limit, search },
  });
  return response.data;
};

export const createCustomer = async (payload: CustomerCreatePayload) => {
  const response = await http.post<Customer>("/customers", payload);
  return response.data;
};

export const updateCustomer = async (id: number, payload: Partial<CustomerCreatePayload>) => {
  const response = await http.put<Customer>(`/customers/${id}`, payload);
  return response.data;
};

export const deleteCustomer = async (id: number) => {
  const response = await http.delete<Customer>(`/customers/${id}`);
  return response.data;
};
