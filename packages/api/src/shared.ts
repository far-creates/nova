import { z } from 'zod';

export const trackLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
export type TrackLevel = z.infer<typeof trackLevelSchema>;

export const accentSchema = z.enum([
  'BRITISH',
  'AMERICAN',
  'CANADIAN',
  'AUSTRALIAN',
]);
export type Accent = z.infer<typeof accentSchema>;

export const sessionTypeSchema = z.enum(['RANDOM', 'TOPIC', 'REVIEW']);
export type SessionType = z.infer<typeof sessionTypeSchema>;

export const attemptSourceSchema = z.enum([
  'HERO_RANDOM',
  'TOPIC_SESSION',
  'REVIEW_SESSION',
]);
export type AttemptSource = z.infer<typeof attemptSourceSchema>;

export const userRoleSchema = z.enum(['GUEST', 'LEARNER', 'CREATOR', 'ADMIN']);
export type UserRole = z.infer<typeof userRoleSchema>;

export const authProviderSchema = z.enum(['PASSWORD', 'PHONE_OTP', 'GOOGLE']);
export type AuthProvider = z.infer<typeof authProviderSchema>;

export const apiMetaSchema = z.object({
  requestId: z.string().min(1).optional(),
  timestamp: z.string().datetime().optional(),
});
export type ApiMeta = z.infer<typeof apiMetaSchema>;

export const apiErrorDetailSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  field: z.string().min(1).optional(),
});

export const apiErrorSchema = z.object({
  ok: z.literal(false),
  error: apiErrorDetailSchema,
  meta: apiMetaSchema.optional(),
});
export type ApiError = z.infer<typeof apiErrorSchema>;

export const createApiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    ok: z.literal(true),
    data: dataSchema,
    meta: apiMetaSchema.optional(),
  });

export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.union([createApiSuccessSchema(dataSchema), apiErrorSchema]);

export type ApiSuccess<T> = {
  ok: true;
  data: T;
  meta?: ApiMeta;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
