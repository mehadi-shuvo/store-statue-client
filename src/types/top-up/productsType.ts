export interface TProduct {
  id: string;
  title: string;
  description?: string;

  price: number;
  offerPercent?: number;

  photos: string[];
  features: string[];

  stockQuantity: number;

  category: {
    title: string;
  };

  reviews: {
    rating: number;
  }[];
}
