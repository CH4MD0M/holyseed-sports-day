'use client';

import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

import { STEPS, type Step } from './_types/step';
import { DEPARTMENTS } from '@/lib/constants/department';
import {
  userProfileSetupSchema,
  type UserProfileSetupSchemaType,
} from '@/lib/schemas/user-profile-setup';

import { useSetupProfile } from '@/hooks/api/use-user-profile';
import { useCellGroups } from './_hooks/use-cell-groups';
import { useProfileStep } from './_hooks/use-profile-step';

import PageLayout from '@/components/layout/page-layout';
import styles from '../_style/profile-form.module.css';

export default function ProfileSetupPage() {
  const { mutateAsync, isPending } = useSetupProfile();

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
  } = useForm<UserProfileSetupSchemaType>({
    resolver: zodResolver(userProfileSetupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      department: undefined,
      birth_year: undefined,
      cell_group: undefined,
    },
  });

  const selectedDepartment = useWatch({ control, name: 'department' });
  const { data: cellGroups, isLoading: isLoadingGroups } = useCellGroups(selectedDepartment);

  const [currentStep] = useProfileStep({
    control,
    trigger,
  });

  const isStepVisible = (requiredStep: Step): boolean => {
    return STEPS.indexOf(currentStep) >= STEPS.indexOf(requiredStep);
  };

  const onSubmit = async (data: UserProfileSetupSchemaType) => {
    const selectedLeader = cellGroups?.find((group) => group.leader_name === data.cell_group);

    const profileData = {
      ...data,
      team: selectedLeader?.team,
    };

    const result = await mutateAsync(profileData);

    if (result.success) {
      toast.success('프로필이 성공적으로 작성되었어요!');

      window.location.href = '/profile';
    } else {
      toast.error(result.error || '프로필 작성에 실패했어요 :(');
    }
  };

  const fieldVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <PageLayout title="프로필 작성" showBackButton={false}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} id="submit-form">
          {/* 이름 입력 */}
          <motion.div
            className={styles.fieldGroup}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
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
          </motion.div>

          {/* 부서 선택 */}
          <AnimatePresence>
            {isStepVisible('department') && (
              <motion.div
                className={styles.fieldGroup}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* 리더 선택  */}
          <AnimatePresence>
            {isStepVisible('cell_group') && selectedDepartment && (
              <motion.div
                className={styles.fieldGroup}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className={styles.label}>가정 리더</label>
                <span className={styles.alertMessage}>가정 리더를 선택해주세요</span>
                <Controller
                  name="cell_group"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`${styles.input} ${errors.cell_group ? styles.inputError : ''}`}
                      disabled={isLoadingGroups}
                    >
                      <option value="">리더를 선택해주세요</option>
                      {cellGroups?.map((group) => (
                        <option key={group.id} value={group.leader_name}>
                          {group.leader_name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.cell_group && (
                  <span className={styles.errorMessage}>{errors.cell_group.message}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 출생연도 입력 */}
          <AnimatePresence>
            {isStepVisible('birth_year') && (
              <motion.div
                className={styles.fieldGroup}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        {/* 제출 버튼 */}
        <AnimatePresence>
          {isStepVisible('submit') && (
            <motion.button
              form="submit-form"
              type="submit"
              className={styles.submitButton}
              disabled={isPending || !isValid}
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
            >
              {isPending ? '저장 중' : '프로필 작성 완료'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
