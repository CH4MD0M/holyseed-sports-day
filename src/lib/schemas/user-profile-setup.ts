import z from 'zod';
import { DEPARTMENTS } from '../constants/department';

const currentYear = new Date().getFullYear();

export const userProfileSetupSchema = z.object({
  name: z
    .string('이름을 입력해주세요.')
    .min(1, '이름을 입력해주세요.')
    .max(50, '이름은 50자 이내로 입력해주세요.')
    .trim(),

  department: z.enum(DEPARTMENTS, '올바른 부서를 선택해주세요.'),

  cell_group: z.string('가정 리더를 선택해주세요.').min(1, '가정 리더를 선택해주세요.').trim(),

  birth_year: z
    .number('출생연도를 입력해주세요.')
    .min(1900, '출생연도는 1900년 이후로 입력해주세요.')
    .max(currentYear, `출생연도는 ${currentYear}년 이전으로 입력해주세요.`)
    .int('출생연도는 정수로 입력해주세요.'),
});

export type UserProfileSetupSchemaType = z.infer<typeof userProfileSetupSchema>;
