import { CartItemSchemaType } from '@/schemas/cart-item-schema';

export interface CartType {
  userId: string;
  userInfo: {
    email: string;
    name: string;
    phone: string;
    shippingTo: string;
  };
  cartItems: CartItemSchemaType[];
}
