// lib/schemas/check-in.ts
import { z } from 'zod';

const isCheckinEnabled = process.env.NEXT_PUBLIC_CHECKIN_ENABLED === 'true';

export const checkinSchema = z.object({
  code: z
    .string()
    .min(1, '코드를 입력해주세요')
    .refine((val) => {
      if (!isCheckinEnabled) return false;

      return val === process.env.NEXT_PUBLIC_CHECKIN_CODE;
    }, '올바르지 않은 코드입니다'),
});

export type CheckinSchemaType = z.infer<typeof checkinSchema>;
