import { createIPXHandler } from '@netlify/ipx';

export const handler = createIPXHandler({
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
      port: '',
      pathname: '**',
    },
  ],
});
