import styles from './user-orders.module.scss';
import OpenOrders from '../open-orders/open-orders';
import ClosedOrders from '../closed-orders/closed-orders';

export default function UserOrders() {
  return (
    <div className={styles.user_orders}>
      <OpenOrders isUser={true} />
      <hr />
      <ClosedOrders isUser={true} />
    </div>
  );
}
