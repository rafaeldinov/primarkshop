'use client';

import { useState } from 'react';
import styles from './signup.module.scss';
import { toast } from 'react-toastify';
import { useForm, SubmitHandler } from 'react-hook-form';
import { SighupSchema, SighupSchemaType } from '@/schemas/signup-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { addUser } from '@/firebase/add-user';
import { InputMask } from '@react-input/mask';
import Loader from '../loader/loader';

export default function Signup({
  setIsOpenSigninModal,
  setIsOpenSignupModal,
}: {
  setIsOpenSigninModal: (isOpenModal: boolean) => void;
  setIsOpenSignupModal: (isOpenModal: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SighupSchemaType>({
    resolver: zodResolver(SighupSchema),
  });

  const onSubmit: SubmitHandler<SighupSchemaType> = async (data) => {
    // change phone value from (099) 999-99-99 to +380999999999
    // remove start-end whitespaces from 'name', 'email, 'shippingTo' if exists
    const userData = {
      ...data,
      name: data.name.trim(),
      email: data.email.trim(),
      shippingTo: data.shippingTo.trim(),
      phone: '+38' + data.phone?.replace(/[^+\d]/g, ''),
    };
    setIsLoading(true);
    const response = await addUser(userData);
    setIsLoading(false);

    if (response?.data?.id) {
      reset();
      setIsOpenSignupModal(false);

      toast.success(`Дякуємо за реєстрацію. Тепер ви можете увійти.`);
      return setIsOpenSigninModal(true);
    }
    if (response?.error) {
      return toast.error(response.error);
    }
  };

  const [isVisiblePassword, setIsVisiblePassword] = useState(false);

  const handleOpenSignIn = () => {
    setIsOpenSigninModal(true);
    setIsOpenSignupModal(false);
  };

  if (isLoading) {
    return <Loader width={50} height={50} />;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
        <h2 className={styles.signup__header}>Реєстрація</h2>
        <div className={styles.signup}>
          <input
            {...register('name')}
            onChange={(evt) =>
              setValue(
                'name',
                evt.currentTarget.value.replace(/\s{2,}/g, ' ') // remove multiple whitespaces
              )
            }
            className={styles.signup__input}
            type='text'
            placeholder={`ім'я та прізвище`}
          />
          {errors.name?.message && (
            <p style={{ color: 'red' }}>{errors.name?.message}</p>
          )}
          <input
            {...register('shippingTo')}
            onChange={(evt) =>
              setValue(
                'shippingTo',
                evt.currentTarget.value.replace(/\s{2,}/g, ' ') // remove multiple whitespaces
              )
            }
            className={styles.signup__input}
            type='text'
            placeholder={'адреса доставки'}
          />
          {errors.shippingTo?.message && (
            <p style={{ color: 'red' }}>{errors.shippingTo?.message}</p>
          )}
          <input
            {...register('email')}
            onChange={
              (evt) =>
                setValue('email', evt.currentTarget.value.replace(/ /g, '')) // remove all whitespaces
            }
            className={styles.signup__input}
            type='email'
            placeholder='електронна пошта'
          />
          {errors.email?.message && (
            <p style={{ color: 'red' }}>{errors.email?.message}</p>
          )}
          <InputMask
            {...register('phone')}
            mask='(___) ___-__-__'
            replacement={{ _: /\d/ }}
            className={styles.signup__input}
            placeholder='(099) 999-99-99'
          />

          {errors.phone?.message && (
            <p style={{ color: 'red' }}>{errors.phone?.message}</p>
          )}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              {...register('password')}
              onChange={
                (evt) =>
                  setValue(
                    'password',
                    evt.currentTarget.value.replace(/ /g, '')
                  ) // remove all whitespaces
              }
              name='password'
              className={styles.signup__input}
              type={isVisiblePassword ? 'text' : 'password'}
              placeholder='пароль'
            />
            <svg
              onClick={() => setIsVisiblePassword(!isVisiblePassword)}
              style={{ cursor: 'pointer' }}
              width='28'
              height='28'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M3.25909 11.6021C3.94254 8.32689 6.79437 6 10 6C13.2057 6 16.0574 8.32688 16.7409 11.6021C16.7974 11.8725 17.0622 12.0459 17.3325 11.9895C17.6029 11.933 17.7763 11.6682 17.7199 11.3979C16.9425 7.67312 13.6934 5 10 5C6.3066 5 3.05742 7.67311 2.28017 11.3979C2.22377 11.6682 2.39718 11.933 2.6675 11.9895C2.93782 12.0459 3.20268 11.8725 3.25909 11.6021Z'
                fill='#212121'
              />
              <path
                d='M10 8C8.067 8 6.5 9.567 6.5 11.5C6.5 13.433 8.067 15 10 15C11.933 15 13.5 13.433 13.5 11.5C13.5 9.567 11.933 8 10 8ZM7.5 11.5C7.5 10.1193 8.61929 9 10 9C11.3807 9 12.5 10.1193 12.5 11.5C12.5 12.8807 11.3807 14 10 14C8.61929 14 7.5 12.8807 7.5 11.5Z'
                fill='#212121'
              />
            </svg>
          </div>
          {errors.password?.message && (
            <p style={{ color: 'red' }}>{errors.password?.message}</p>
          )}
        </div>

        <div className={styles.signup__submit_clear_buttons}>
          <input
            className={styles.signup__button}
            type='submit'
            value='зареєструватись'
          />
          <button
            onClick={() => reset()}
            className={styles.signup__button}
            type='button'
          >
            Очистити
          </button>
        </div>
      </form>
      {
        <p className={styles.signin_link}>
          <span className={styles.signin_link__text}>
            Якщо ви вже зареєстровані
          </span>
          <button
            onClick={handleOpenSignIn}
            className={styles.signin_link__button}
            type='button'
          >
            Увійти
          </button>
        </p>
      }
    </div>
  );
}
