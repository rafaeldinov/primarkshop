import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';
import { AppRouteEnum, UserRoleEnum } from '../const';
import AdminPanel from '@/components/admin-panel/admin-panel';
import { authConfig } from '../api/auth/[...nextauth]/route';
import Header from '@/components/header/header';

export default async function Admin() {
  const session = await getServerSession(authConfig);
  const role = session?.user.role;

  if (session?.user.role === UserRoleEnum.User || !session?.user.role) {
    return redirect(AppRouteEnum.Root);
  }

  return (
    <div className={styles.admin}>
      <Header />
      <AdminPanel role={role} />
    </div>
  );
}
