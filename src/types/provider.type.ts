export interface Provider {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  priceRange: string;
  coverImage: string;
  logo: string;
  signatureDish: {
    name: string;
    image: string;
    price: string;
  };
}
