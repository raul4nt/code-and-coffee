export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  category: 'Coffee' | 'Snack' | 'Dessert';
  imageUrl?: string;
  added?: boolean;
}
