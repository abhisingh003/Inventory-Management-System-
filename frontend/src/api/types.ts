export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  price: string | number;
  stock_quantity: number;
  created_at: string;
}

export interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: string | number;
  product_name?: string | null;
}

export interface OrderInputItem {
  id: number;
  product_id: number;
  quantity: number;
}

export interface Order {
  id: number;
  customer_id: number;
  total_amount: string | number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}