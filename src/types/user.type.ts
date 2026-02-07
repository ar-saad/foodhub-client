import { Provider } from "./provider.type";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: string;
  phone?: string;
  address?: string;
  status: string;
  providerProfile?: Provider;
}
