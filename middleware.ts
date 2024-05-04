import { withAuth } from 'next-auth/middleware';
import { UserRoleEnum } from './app/const';

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname === '/admin') {
        return (
          token?.role === UserRoleEnum.Admin ||
          token?.role === UserRoleEnum.Editor
        );
      }
      return Boolean(token);
    },
  },
});

export const config = {
  matcher: ['/profile', '/admin', '/verifyemail/:path*'],
};
