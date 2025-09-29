import { useEffect, useState } from 'react';
import { useWatch, type Control, type UseFormTrigger } from 'react-hook-form';

import { Step } from '../_types/step';
import type { UserProfileSchemaType } from '@/lib/schemas/user-profile';

interface UseProfileStepProps {
  control: Control<UserProfileSchemaType>;
  trigger: UseFormTrigger<UserProfileSchemaType>;
}

export function useProfileStep({ control, trigger }: UseProfileStepProps) {
  const [currentStep, setCurrentStep] = useState<Step>('name');

  const watchedName = useWatch({ control, name: 'name' });
  const watchedDepartment = useWatch({ control, name: 'department' });
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
          setCurrentStep('birth_year');
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
  }, [currentStep, watchedName, watchedDepartment, watchedBirthYear, trigger, setCurrentStep]);

  return [currentStep];
}
