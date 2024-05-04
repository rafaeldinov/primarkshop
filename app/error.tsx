'use client';

import Link from 'next/link';
import { AppRouteEnum } from '../app/const';

export default function Error({ error }: { error: Error }) {
  return (
    <div>
      <p>{`ERROR: ${error.message}`}</p>
      <Link href={AppRouteEnum.Root}>Back to main page</Link>
    </div>
  );
}
