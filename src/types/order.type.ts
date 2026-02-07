export enum OrderStatus {
  PLACED = "PLACED",
  PREPARING = "PREPARING",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentType {
  COD = "COD",
}

export interface OrderItem {
  mealId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  customerId: string;
  providerId: string;
  orderItems: OrderItem[];
  totalAmount: number;
  address: string;
  paymentType: PaymentType;
}

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  orderItems: OrderItem[];
  totalAmount: string;
  address: string;
  paymentType: PaymentType;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
}
