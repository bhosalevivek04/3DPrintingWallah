import { ProductCategory, ProductAvailability } from "./product";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  category: ProductCategory;
  image: string;
  unitPrice: number;
  priceDisplay: string;
  quantity: number;
  availability: ProductAvailability;
  maxAllowedQuantity: number;
  selectedColor?: string;
  material?: string;
}

export interface CartState {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  isLoaded: boolean;
}

export interface AddToCartOptions {
  productId: string;
  slug: string;
  name: string;
  category: ProductCategory;
  image: string;
  unitPrice: number;
  priceDisplay: string;
  availability: ProductAvailability;
  maxAllowedQuantity: number;
  selectedColor?: string;
  material?: string;
}

export interface CartContextValue extends CartState {
  addItem: (item: AddToCartOptions, quantity?: number) => { success: boolean; message: string };
  removeItem: (productId: string, selectedColor?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string, selectedColor?: string) => number;
}
