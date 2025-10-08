'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { HashLoader } from 'react-spinners';
import { CheckCircle2, Sparkles, Trophy } from 'lucide-react';

import { checkinSchema, type CheckinSchemaType } from '@/lib/schemas/check-in';
import { useCheckInStatus, useCheckIn } from './_hooks/use-check-in';

import MainLayout from '@/components/layout/main-layout';
import styles from './check-in-page.module.css';

const CheckInPage = () => {
  const { data: checkInStatus, isLoading } = useCheckInStatus();
  const checkInMutation = useCheckIn();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CheckinSchemaType>({
    resolver: zodResolver(checkinSchema),
    mode: 'onChange',
  });

  const onSubmit = async () => {
    const result = await checkInMutation.mutateAsync();

    if (!result.success) {
      setError('code', {
        message: result.error || '체크인에 실패했습니다.',
      });
      return;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <HashLoader color="#059669" size={50} speedMultiplier={0.8} />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (checkInStatus?.isCheckedIn) {
    return (
      <MainLayout>
        <div className={styles.container}>
          <motion.div
            className={styles.resultContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success Icon with Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className={styles.iconWrapper}
            >
              <CheckCircle2 className={styles.successIcon} />
            </motion.div>

            {/* Title */}
            <motion.h2
              className={styles.resultTitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              체크인 완료!
            </motion.h2>

            {/* Name */}
            <motion.p
              className={styles.resultName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {checkInStatus.name}
            </motion.p>

            {/* Lottery Number Card */}
            <motion.div
              className={styles.lotteryCard}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.5,
              }}
            >
              <div className={styles.lotteryLabel}>
                <Trophy className={styles.trophyIcon} />
                <span>추첨 번호</span>
              </div>
              <div className={styles.lotteryNumber}>{checkInStatus.lotteryNumber}</div>
            </motion.div>

            {/* Early Bird Badge */}
            {checkInStatus.isEarlyBird && (
              <motion.div
                className={styles.earlyBirdBadge}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Sparkles className={styles.sparkleIcon} />
                <span>얼리버드 달성!</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <motion.div
            className={styles.fieldGroup}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label htmlFor="code" className={styles.label}>
              체크인 코드 입력
            </label>
            <input
              id="code"
              type="text"
              {...register('code')}
              className={`${styles.input} ${errors.code ? styles.inputError : ''}`}
              placeholder="코드를 입력하세요"
              disabled={isSubmitting || checkInMutation.isPending}
            />
            {errors.code && <span className={styles.errorMessage}>{errors.code.message}</span>}
          </motion.div>

          <button
            type="submit"
            disabled={isSubmitting || checkInMutation.isPending}
            className={styles.submitButton}
          >
            {isSubmitting || checkInMutation.isPending ? '체크인 중...' : '체크인'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default CheckInPage;
