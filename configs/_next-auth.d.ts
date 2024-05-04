import NextAuth from 'next-auth';
import { UserAuthType } from '../types/user-types';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: UserAuthType;
    expires: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    phone: string;
    createdAt: string;
    role: string;
    shippingTo: string;
  }
}
