'use client';

import FormAddUpdateCard from '../form-add-update-card/form-add-update-card';
import FormRemoveCard from '../form-remove-card/form-remove-card';
import styles from './admin-panel.module.scss';
import AdminSidebar from '../admin-sidebar/admin-sidebar';
import { useEffect, useState } from 'react';
import { SidebarAdminTabs, UserRoleEnum } from '@/app/const';
import OpenOrders from '../open-orders/open-orders';
import ClosedOrders from '../closed-orders/closed-orders';
import AdminUsers from '../admin-users/admin-users';
import { useCardsStore } from '@/store/cards-store';

interface Props {
  role: string | undefined;
}

export default function AdminPanel({ role }: Props) {
  const [activeTab, setActiveTab] = useState<string>(SidebarAdminTabs.AddCard);

  const formAddUpdateCardCards = useCardsStore(
    (state) => state.formAddUpdateCardCards
  );

  const getFormAddUpdateCardCards = useCardsStore(
    (state) => state.getFormAddUpdateCardCards
  );
  const getFormRemoveCardCards = useCardsStore(
    (state) => state.getFormRemoveCardCards
  );

  useEffect(() => {
    getFormAddUpdateCardCards();
    getFormRemoveCardCards();
  }, [getFormAddUpdateCardCards, getFormRemoveCardCards]);

  return (
    <div className={styles.admin_panel}>
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
      />
      <div className={styles.admin_panel__content}>
        {activeTab === SidebarAdminTabs.AddCard && (
          <FormAddUpdateCard cards={formAddUpdateCardCards} />
        )}

        {activeTab === SidebarAdminTabs.DeleteCard && <FormRemoveCard />}
        {activeTab === SidebarAdminTabs.OpenOrders && (
          <OpenOrders isUser={false} />
        )}
        {activeTab === SidebarAdminTabs.ClosedOrders && (
          <ClosedOrders isUser={false} />
        )}
        {activeTab === SidebarAdminTabs.Users &&
          role === UserRoleEnum.Admin && <AdminUsers />}
      </div>
    </div>
  );
}
