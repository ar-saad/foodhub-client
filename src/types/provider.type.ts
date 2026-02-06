import { Meal } from "./meal.type";
import { User } from "./user.type";

export interface Provider {
  id: string;
  userId: string;
  name: string;
  address: string;
  description?: string;
  logo?: string;
  isOpen: boolean;
  user: User;
  meals?: Meal[];
}
