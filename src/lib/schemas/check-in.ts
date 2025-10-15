import { z } from 'zod';

export const checkinSchema = z.object({
  code: z
    .string()
    .min(1, '코드를 입력해주세요')
    .refine((val) => {
      return val === process.env.NEXT_PUBLIC_CHECKIN_CODE;
    }, '올바르지 않은 코드입니다'),
});

export type CheckinSchemaType = z.infer<typeof checkinSchema>;
