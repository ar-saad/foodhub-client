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

export interface PopulatedOrderItem {
  mealId: string;
  quantity: number;
  price: number;
  meal?: {
    id: string;
    name: string;
    image: string;
  };
}

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  orderItems: PopulatedOrderItem[];
  totalAmount: string;
  address: string;
  paymentType: PaymentType;
  status: OrderStatus;
  createdAt?: string;
  updatedAt?: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  providerProfile?: {
    id: string;
    name: string;
    logo?: string;
  };
}
