'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import { DEPARTMENTS } from '@/lib/constants/department';
import { userProfileSchema, type UserProfileSchemaType } from '@/lib/schemas/user-profile';
import { useGetUserProfile, useUpdateProfile } from '@/hooks/api/use-user-profile';

import PageLayout from '@/components/layout/page-layout';
import styles from '../_style/profile-form.module.css';
import { useRouter } from 'next/navigation';

const ProfileEditPage = () => {
  const router = useRouter();

  const { data: userProfile, isLoading } = useGetUserProfile();
  const { mutateAsync, isPending } = useUpdateProfile();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<UserProfileSchemaType>({
    resolver: zodResolver(userProfileSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      department: undefined,
      birth_year: undefined,
    },
  });

  const onSubmit = async (data: UserProfileSchemaType) => {
    const result = await mutateAsync(data);

    if (result.success) {
      toast.success('프로필이 성공적으로 수정되었어요!');

      router.replace('/profile');
    } else {
      toast.error(result.error || '프로필 수정에 실패했어요 :(');
    }
  };

  // 프로필 데이터 로드 후 폼 초기화
  useEffect(() => {
    if (userProfile) {
      reset({
        name: userProfile.name ?? '',
        department: userProfile.department ?? undefined,
        birth_year: userProfile.birth_year ?? undefined,
      });
    }
  }, [userProfile, reset]);

  if (isLoading) {
    return (
      <PageLayout title="프로필 수정">
        <div className={styles.container}>로딩 중...</div>
      </PageLayout>
    );
  }

  if (!userProfile) {
    return (
      <PageLayout title="프로필 수정">
        <div className={styles.container}>프로필을 찾을 수 없습니다.</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="프로필 수정">
      <div className={styles.container}>
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          id="edit-profile-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* 이름 입력 */}
          <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>
              이름
            </label>
            <span className={styles.alertMessage}>
              <strong>{'"성 + 이름"'}</strong> 형태로 입력해주셔야 돼요! 예) 홍길동
            </span>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="name"
                  type="text"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="이름을 입력해주세요"
                />
              )}
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
          </div>

          {/* 부서 선택 */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>부서</label>
            <Controller
              name="department"
              control={control}
              render={({ field }) => (
                <div className={styles.departmentButtons}>
                  {DEPARTMENTS.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => field.onChange(dept)}
                      className={`${styles.departmentButton} ${
                        field.value === dept ? styles.departmentButtonSelected : ''
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.department && (
              <span className={styles.errorMessage}>{errors.department.message}</span>
            )}
          </div>

          {/* 출생연도 입력 */}
          <div className={styles.fieldGroup}>
            <label htmlFor="birth_year" className={styles.label}>
              출생연도
            </label>
            <span className={styles.alertMessage}>숫자 4자리로 입력해주세요! 예) 1996</span>
            <Controller
              name="birth_year"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="birth_year"
                  type="number"
                  className={`${styles.input} ${errors.birth_year ? styles.inputError : ''}`}
                  placeholder="출생연도를 입력해주세요"
                  onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                />
              )}
            />
            {errors.birth_year && (
              <span className={styles.errorMessage}>{errors.birth_year.message}</span>
            )}
          </div>
        </motion.form>

        <button
          type="submit"
          form="edit-profile-form"
          className={styles.submitButton}
          disabled={isPending || !isValid || !isDirty}
        >
          {isPending ? '저장 중' : '프로필 수정 완료'}
        </button>
      </div>
    </PageLayout>
  );
};

export default ProfileEditPage;
