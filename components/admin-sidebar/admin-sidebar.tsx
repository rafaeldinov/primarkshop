'use client';

import { SidebarAdminTabs, UserRoleEnum } from '@/app/const';
import { MenuList, MenuItem } from '@mui/material';
import styles from './admin-sidebar.module.scss';
import { SetStateAction, SyntheticEvent } from 'react';

interface Props {
  activeTab: string;
  setActiveTab: React.Dispatch<SetStateAction<string>>;
  role: string | undefined;
}

export default function AdminSidebar({ activeTab, setActiveTab, role }: Props) {
  const handleActiveTabClick = (evt: SyntheticEvent<HTMLLIElement>) => {
    const title = evt.currentTarget.title;
    setActiveTab(title);
  };

  return (
    <div className={styles.sidebar}>
      <MenuList className={styles.sidebar__menu}>
        <MenuItem
          onClick={(evt) => handleActiveTabClick(evt)}
          className={styles.sidebar__menu_item}
          title={SidebarAdminTabs.AddCard}
          selected={activeTab === SidebarAdminTabs.AddCard}
        >
          <p className={styles.sidebar__menu_item_text}>додати картку</p>
        </MenuItem>

        <MenuItem
          onClick={(evt) => handleActiveTabClick(evt)}
          className={styles.sidebar__menu_item}
          title={SidebarAdminTabs.DeleteCard}
          selected={activeTab === SidebarAdminTabs.DeleteCard}
        >
          <p className={styles.sidebar__menu_item_text}>видалити картку</p>
        </MenuItem>

        <MenuItem
          onClick={(evt) => handleActiveTabClick(evt)}
          className={styles.sidebar__menu_item}
          title={SidebarAdminTabs.OpenOrders}
          selected={activeTab === SidebarAdminTabs.OpenOrders}
        >
          <p className={styles.sidebar__menu_item_text}>активні замовлення</p>
        </MenuItem>

        <MenuItem
          onClick={(evt) => handleActiveTabClick(evt)}
          className={styles.sidebar__menu_item}
          title={SidebarAdminTabs.ClosedOrders}
          selected={activeTab === SidebarAdminTabs.ClosedOrders}
        >
          <p className={styles.sidebar__menu_item_text}>виконані замовлення</p>
        </MenuItem>

        {role === UserRoleEnum.Admin && (
          <MenuItem
            onClick={(evt) => handleActiveTabClick(evt)}
            className={styles.sidebar__menu_item}
            title={SidebarAdminTabs.Users}
            selected={activeTab === SidebarAdminTabs.Users}
          >
            <p className={styles.sidebar__menu_item_text}>користувачі</p>
          </MenuItem>
        )}
      </MenuList>
    </div>
  );
}
