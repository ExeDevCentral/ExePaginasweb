export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'landing' | 'ecommerce' | 'system' | 'custom';
  image?: string;
  features: string[];
}

export interface CartItem extends Product {
  quantity: number;
}