import { useEffect, useState } from 'react';
import { useWatch, type Control, type UseFormTrigger } from 'react-hook-form';

import { Step } from '../_types/step';
import { type UserProfileSetupSchemaType } from '@/lib/schemas/user-profile-setup';

interface UseProfileStepProps {
  control: Control<UserProfileSetupSchemaType>;
  trigger: UseFormTrigger<UserProfileSetupSchemaType>;
}

export function useProfileStep({ control, trigger }: UseProfileStepProps) {
  const [currentStep, setCurrentStep] = useState<Step>('name');

  const watchedName = useWatch({ control, name: 'name' });
  const watchedDepartment = useWatch({ control, name: 'department' });
  const watchedCellGroup = useWatch({ control, name: 'cell_group' });
  const watchedBirthYear = useWatch({ control, name: 'birth_year' });

  useEffect(() => {
    const progressStep = async () => {
      // 이름 스텝 체크
      if (currentStep === 'name' && watchedName?.trim()) {
        const isValid = await trigger('name');
        if (isValid) {
          setCurrentStep('department');
          return;
        }
      }

      // 부서 스텝 체크
      if (currentStep === 'department' && watchedDepartment) {
        const isValid = await trigger('department');
        if (isValid) {
          setCurrentStep('cell_group'); // 리더 선택으로 이동
          return;
        }
      }

      // 리더 스텝 체크 (새로 추가!)
      if (currentStep === 'cell_group' && watchedCellGroup) {
        const isValid = await trigger('cell_group');
        if (isValid) {
          setCurrentStep('birth_year'); // 출생연도로 이동
          return;
        }
      }

      // 출생연도 스텝 체크
      if (currentStep === 'birth_year' && watchedBirthYear) {
        const isValid = await trigger('birth_year');
        if (isValid) setCurrentStep('submit');
      }
    };

    progressStep();
  }, [currentStep, watchedName, watchedDepartment, watchedCellGroup, watchedBirthYear, trigger]);

  return [currentStep];
}
