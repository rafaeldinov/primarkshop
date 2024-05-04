import { serverTimestamp } from 'firebase/database';

export interface UserStoreType {
  email: string;
  phone: string;
  emailVerified: boolean;
  name: string;
  role: string;
  shippingTo: string;
  createdAt: string;
  id: string;
}

export interface UserDocType {
  email: string;
  phone: string;
  emailVerified: boolean;
  name: string;
  role: string;
  passwordHash: string;
  shippingTo: string;
  verifyEmailToken?: string;
}

export interface UserAuthType {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  phone: string;
  createdAt: string;
  role: string;
  shippingTo: string;
}
