import UserProfile from '@/components/user-profile/user-profile';
import { getServerSession } from 'next-auth';
import styles from './page.module.scss';
import { authConfig } from '../api/auth/[...nextauth]/route';
import Header from '@/components/header/header';

export default async function Profile() {
  const session = await getServerSession(authConfig);
  const user = session?.user;
  return (
    session && (
      <div className={styles.profile}>
        <Header />
        <UserProfile user={user} />
      </div>
    )
  );
}
