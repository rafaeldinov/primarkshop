import { CartItemSchemaType } from '@/schemas/cart-item-schema';

export interface OrderDocType extends OrderType {
  id: string;
  userInfo: {
    email: string;
    name: string;
    phone: string;
    shippingTo: string;
  };
}

export interface OrderType {
  userId: string;
  totalCost: number;
  totalWeight: number;
  createdAt?: Date;
  cartItems: CartItemSchemaType[];
}
