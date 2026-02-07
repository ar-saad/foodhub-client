import { Meal } from "./meal.type";

export interface CartItem {
  meal: Meal;
  quantity: number;
}

export interface Cart {
  providerId: string | null;
  providerName: string | null;
  items: CartItem[];
}
