import styles from './user-profile-sidebar.module.scss';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import LocalPostOfficeOutlinedIcon from '@mui/icons-material/LocalPostOfficeOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { SetStateAction, SyntheticEvent } from 'react';
import { SidebarUserTabs } from '@/app/const';

type Props = {
  activeTab: string;
  setActiveTab: React.Dispatch<SetStateAction<string>>;
};

export default function UserProfileSidebar({ activeTab, setActiveTab }: Props) {
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
          title={SidebarUserTabs.Info}
          selected={activeTab === SidebarUserTabs.Info}
        >
          <PermIdentityOutlinedIcon className={styles.sidebar__icon} />
          <p className={styles.sidebar__menu_item_text}>дані користувача</p>
        </MenuItem>
        <MenuItem
          onClick={(evt) => handleActiveTabClick(evt)}
          title={SidebarUserTabs.Update}
          className={styles.sidebar__menu_item}
          selected={activeTab === SidebarUserTabs.Update}
        >
          <ManageAccountsOutlinedIcon className={styles.sidebar__icon} />
          <p className={styles.sidebar__menu_item_text}>оновити дані</p>
        </MenuItem>
        <MenuItem
          onClick={(evt) => handleActiveTabClick(evt)}
          title={SidebarUserTabs.Orders}
          className={styles.sidebar__menu_item}
          selected={activeTab === SidebarUserTabs.Orders}
        >
          <ShoppingBagOutlinedIcon className={styles.sidebar__icon} />
          <p className={styles.sidebar__menu_item_text}>мої замовлення</p>
        </MenuItem>
        <MenuItem
          onClick={(evt) => handleActiveTabClick(evt)}
          title={SidebarUserTabs.Feedback}
          className={styles.sidebar__menu_item}
          selected={activeTab === SidebarUserTabs.Feedback}
        >
          <LocalPostOfficeOutlinedIcon className={styles.sidebar__icon} />
          <p
            className={styles.sidebar__menu_item_text}
          >{`зворотній зв'язок`}</p>
        </MenuItem>
        <hr />
        <MenuItem
          onClick={(evt) => handleActiveTabClick(evt)}
          title={SidebarUserTabs.DeleteAccount}
          className={styles.sidebar__menu_item}
          selected={activeTab === SidebarUserTabs.DeleteAccount}
        >
          <PersonRemoveOutlinedIcon className={styles.sidebar__icon} />
          <p className={styles.sidebar__menu_item_text}>видалити акаунт</p>
        </MenuItem>
      </MenuList>
    </div>
  );
}
