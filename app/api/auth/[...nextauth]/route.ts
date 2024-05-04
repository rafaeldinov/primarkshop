import Credentials from 'next-auth/providers/credentials';
import { AppRouteEnum } from '@/app/const';
import signinWithEmailAndPassword from '@/firebase/signin-with-email';
import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import { ZodError } from 'zod';

export const authConfig: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email', type: 'email', required: true },
        password: { label: 'password', type: 'password', required: true },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) {
          return null;
        }
        const { error, data } = await signinWithEmailAndPassword(
          email,
          password
        );

        if (data) {
          const user = data.doc;
          return {
            id: user.id,
            email: user.data().email,
            emailVerified: user.data().emailVerified,
            name: user.data().name,
            phone: user.data().phone,
            shippingTo: user.data().shippingTo,
            createdAt: user.createTime.toDate().toLocaleDateString('ua-UA', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }),
            role: user.data().role,
          };
        }
        if (error) {
          const typedError = error as string | ZodError;
          if (typeof typedError === 'string') {
            throw new Error(typedError);
          }
          throw new Error(typedError.issues[0].message);
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        return { ...token, ...session?.user };
      }

      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.emailVerified = token.emailVerified;
      session.user.name = token.name;
      session.user.phone = token.phone;
      session.user.createdAt = token.createdAt;
      session.user.shippingTo = token.shippingTo;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 1 day
  },
  secret: process.env.NEXTAUTH_SECRET!,
  pages: { signIn: AppRouteEnum.Root },
};

const handler = NextAuth(authConfig);
export { handler as POST, handler as GET };
