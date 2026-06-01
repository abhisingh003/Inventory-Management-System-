import { http } from "./api";
import type { PaginatedResponse, Order, OrderItem } from "./types";

export interface OrderCreatePayload {
  customer_id: number;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export const fetchOrders = async (page = 1, limit = 20, search = "") => {
  const response = await http.get<PaginatedResponse<Order>>("/orders", {
    params: { page, limit, search },
  });
  return response.data;
};

export const fetchOrder = async (id: number) => {
  const response = await http.get<Order>(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (payload: OrderCreatePayload) => {
  const response = await http.post<Order>("/orders", payload);
  return response.data;
};

export const buildOrderItem = (product_id: number, quantity: number): OrderItem => ({
  id: Date.now(),
  product_id,
  quantity,
  price: 0,
  product_name: "",
});
