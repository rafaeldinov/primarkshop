import styles from './form-feedback.module.scss';
import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { sendMessageToBot } from '@/configs/telegram-bot/bot';

export default function FormFeedback() {
  const feedbackRef = useRef<HTMLTextAreaElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const { data: user, status } = useSession();

  const handleSendFeedbackClick = async () => {
    if (status === 'unauthenticated') {
      return toast.error('ви не увійшли в систему');
    }
    if (!feedbackRef.current?.value) {
      return toast.error('напишіть повідомлення');
    }

    setIsLoading(true);
    await sendMessageToBot(
      `
id: ${user?.user.id}
ім'я: ${user?.user.name}
номер: ${user?.user.phone}
пошта: ${user?.user.email}
повідомлення: ${feedbackRef.current?.value}`
    );

    setIsLoading(false);
    feedbackRef.current.value = '';
    toast.success('повідомлення успішно надіслано');
  };
  return (
    <div className={styles.container}>
      <div className={styles.form_feedback}>
        <textarea
          ref={feedbackRef}
          className={styles.form_feedback__comment}
          name='comment'
          placeholder='Залиште свій коментар'
          disabled={isLoading}
        />
        <button
          onClick={() => {
            if (feedbackRef.current?.value) {
              feedbackRef.current.value = '';
            }
          }}
          className={styles.form_feedback__send}
          type='button'
          disabled={isLoading}
        >
          очистити
        </button>
        <button
          onClick={handleSendFeedbackClick}
          className={styles.form_feedback__send}
          type='button'
          disabled={isLoading}
        >
          надіслати
        </button>
      </div>
    </div>
  );
}
