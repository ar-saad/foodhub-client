"use server";

import { orderService } from "@/services/order.service";
import { CreateOrderPayload } from "@/types/order.type";

export async function createOrder(payload: CreateOrderPayload) {
  return await orderService.create(payload);
}
