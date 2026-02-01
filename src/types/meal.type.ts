import { Category } from "./category.type";
import { Provider } from "./provider.type";

export interface Meal {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: string;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  providerProfile?: Provider;
  category?: Category;
}
