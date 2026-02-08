"use server";

import { orderService } from "@/services/order.service";
import { CreateOrderPayload } from "@/types/order.type";

export async function getOrders(params: {
  customerId?: string;
  providerId?: string;
  page?: string;
  limit?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  return await orderService.getOrders(params);
}

export async function getOrder(orderId: string) {
  return await orderService.getOrder(orderId);
}

export async function createOrder(payload: CreateOrderPayload) {
  return await orderService.create(payload);
}

export async function updateOrderStatus({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  return await orderService.updateOrderStatus({ orderId, status });
}
