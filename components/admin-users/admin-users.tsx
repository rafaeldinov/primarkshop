'use client';

import { useUsersStore } from '@/store/users-store';
import styles from './admin-users.module.scss';
import Loader from '../loader/loader';
import { useEffect, useState } from 'react';
import { UserStoreType } from '@/types/user-types';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { signOut, useSession } from 'next-auth/react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { UserRoleEnum } from '@/app/const';
import { toast } from 'react-toastify';
import Modal from '../modal/modal';
import Box from '@mui/material/Box/Box';
import TextField from '@mui/material/TextField/TextField';

interface StateUserOrders extends UserStoreType {
  isOpen: boolean;
}

export default function AdminUsers() {
  const [stateUsers, setStateUsers] = useState<StateUserOrders[]>([]);
  const [roleValue, setRoleValue] = useState<string>('');
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false);
  const [search, setSearch] = useState('');
  const [isHide, setIsHide] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoleValue((event.target as HTMLInputElement).value);
  };

  const { data: session, update } = useSession();

  const users = useUsersStore((state) => state.users);
  const error = useUsersStore((state) => state.error);
  const isLoading = useUsersStore((state) => state.isLoading);
  const getUsers = useUsersStore((state) => state.getUsers);
  const deleteUser = useUsersStore((state) => state.deleteUser);
  const changeRole = useUsersStore((state) => state.changeRole);

  useEffect(() => {
    const modifiedOrders = users.map((item) => ({
      isOpen: false,
      ...item,
    }));
    setStateUsers(modifiedOrders);
  }, [users]);

  const handleSetCurrentUserClick = (index: number) => {
    const users = [...stateUsers];
    const isOpen = users[index].isOpen;
    if (isOpen) {
      users[index].isOpen = false;
    } else {
      users[index].isOpen = true;
    }
    setStateUsers(users);
  };

  const handleDeleteAccountClick = async (id: string) => {
    await deleteUser(id);

    if (session?.user.id === id) {
      return signOut();
    }
    toast.success(`користувач ${id} успішно видаленний`);
  };

  const handleChangeRoleClick = async (currentRole: string, id: string) => {
    if (!roleValue) {
      return toast.error('виберіть роль');
    }
    if (currentRole === roleValue) {
      return toast.error('це поточна роль користувача');
    }

    const updatedAt = await changeRole(roleValue, id);
    toast.success('роль користувача успішно змінена');

    if (session?.user.id === id && updatedAt) {
      const newSession = {
        ...session,
        user: {
          ...session?.user,
          role: roleValue,
        },
      };
      await update(newSession);
    }
  };

  if (isLoading) {
    return <Loader width={50} height={50} />;
  }

  return (
    <div className={styles.admin_users}>
      <button
        onClick={getUsers}
        className={styles.admin_users__button}
        type='button'
        disabled={isLoading}
      >
        користувачі
      </button>
      {stateUsers.length > 0 && (
        <button
          onClick={() => setIsHide(!isHide)}
          type='button'
          className={styles.admin_users__expand}
        >
          {isHide ? 'розгорнути' : 'згорнути'}
          {isHide ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>
      )}
      <Box
        className={styles.admin_users__search}
        component='form'
        noValidate
        autoComplete='off'
      >
        <TextField
          onChange={(evt) => setSearch(evt.currentTarget.value)}
          id='standard-basic'
          label='фільтрація за номером телефону'
          variant='standard'
          InputLabelProps={{
            style: { wordBreak: 'break-word' },
            className: styles.admin_users__search_input,
          }}
        />
      </Box>
      {error && <p className={styles.admin_users__error}>{error}</p>}
      {!isHide && (
        <div className={styles.admin_users__list}>
          {stateUsers
            .filter((item) => {
              return search === ''
                ? item
                : item.phone
                    .replace(/ /g, '')
                    .includes(search.replace(/ /g, ''));
            })
            .map((item, index) => {
              return (
                <div key={item.id} className={styles.admin_users__item}>
                  <p
                    onClick={() => handleSetCurrentUserClick(index)}
                    className={styles.admin_users__item_header}
                  >
                    <span>{item.phone}</span>

                    {item.isOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                  </p>

                  {item.isOpen && (
                    <div>
                      <div className={styles.admin_users__info}>
                        <p>
                          <b>{`Ім'я`}: </b>
                          {item.name}
                        </p>
                        <p>
                          <b>Пошта: </b>
                          {item.email}
                        </p>
                        <p>
                          <b>Веріфікація: </b>
                          {item.emailVerified
                            ? 'веріфіковано'
                            : 'не веріфіковано'}
                        </p>
                        <p>
                          <b>Роль: </b>
                          {item.role}
                        </p>
                        <p>
                          <b>Адреса доставки: </b>
                          {item.shippingTo}
                        </p>
                        <p>
                          <b>Індетіфікатор: </b>
                          {item.id}
                        </p>
                        <p>
                          <b>Дата реєстрації: </b>
                          {item.createdAt}
                        </p>
                      </div>
                      <div className={styles.admin_users__buttons}>
                        <button
                          onClick={() => setIsOpenConfirmModal(true)}
                          className={styles.admin_users__buttons_item}
                          type='button'
                        >
                          видалити акаунт
                        </button>
                        <button
                          onClick={() =>
                            handleChangeRoleClick(item.role, item.id)
                          }
                          className={styles.admin_users__buttons_item}
                          type='button'
                          disabled={roleValue ? false : true}
                        >
                          змінити роль
                        </button>
                      </div>
                      <FormControl className={styles.admin_users__radio}>
                        <RadioGroup
                          style={{ flexDirection: 'row' }}
                          className={styles.admin_users__radio_group}
                          aria-labelledby='demo-controlled-radio-buttons-group'
                          name='controlled-radio-buttons-group'
                          value={roleValue}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value={UserRoleEnum.User}
                            control={<Radio />}
                            label={UserRoleEnum.User}
                          />
                          <FormControlLabel
                            value={UserRoleEnum.Editor}
                            control={<Radio />}
                            label={UserRoleEnum.Editor}
                          />
                          <FormControlLabel
                            value={UserRoleEnum.Admin}
                            control={<Radio />}
                            label={UserRoleEnum.Admin}
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  )}
                  {isOpenConfirmModal && (
                    <Modal
                      isOpenModal={isOpenConfirmModal}
                      setIsOpenModal={setIsOpenConfirmModal}
                    >
                      <div className={styles.admin_users__delete_account_modal}>
                        <p>
                          Видалення акаунту <b>{item.name}</b>
                        </p>

                        <button
                          onClick={() => handleDeleteAccountClick(item.id)}
                          className={styles.admin_users__buttons_item}
                          type='button'
                        >
                          видалити акаунт
                        </button>
                      </div>
                    </Modal>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
