import { z } from 'zod';
import {
  authProviderSchema,
  createApiResponseSchema,
  userRoleSchema,
} from './shared';

export const sessionActorSchema = z.object({
  id: z.string().min(1),
  username: z.string().min(1),
  role: userRoleSchema,
  phoneNumber: z.string().min(1).nullable().optional(),
  email: z.email().nullable().optional(),
});
export type SessionActor = z.infer<typeof sessionActorSchema>;

export const passwordLoginRequestSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
  guestSessionId: z.string().min(1).optional(),
});
export type PasswordLoginRequest = z.infer<typeof passwordLoginRequestSchema>;

export const phoneOtpRequestStartSchema = z.object({
  phoneNumber: z.string().min(1),
});
export type PhoneOtpRequestStart = z.infer<typeof phoneOtpRequestStartSchema>;

export const phoneOtpRequestVerifySchema = z.object({
  phoneNumber: z.string().min(1),
  code: z.string().min(1),
  guestSessionId: z.string().min(1).optional(),
});
export type PhoneOtpRequestVerify = z.infer<typeof phoneOtpRequestVerifySchema>;

export const googleLoginRequestSchema = z.object({
  idToken: z.string().min(1),
  guestSessionId: z.string().min(1).optional(),
});
export type GoogleLoginRequest = z.infer<typeof googleLoginRequestSchema>;

export const signupRequestSchema = z
  .object({
    username: z.string().min(1),
    password: z.string().min(1),
    email: z.email().optional(),
    phoneNumber: z.string().min(1).optional(),
    guestSessionId: z.string().min(1).optional(),
  })
  .refine((value) => Boolean(value.email || value.phoneNumber), {
    message: 'Either email or phoneNumber must be provided.',
    path: ['email'],
  });
export type SignupRequest = z.infer<typeof signupRequestSchema>;

export const authSessionPayloadSchema = z.object({
  actor: sessionActorSchema,
  providers: z.array(authProviderSchema),
  mergedGuestSessionId: z.string().min(1).nullable().optional(),
});
export type AuthSessionPayload = z.infer<typeof authSessionPayloadSchema>;

export const legacyAuthUserSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  username: z.string().min(1).nullable(),
  createdAt: z.string(),
});
export type LegacyAuthUser = z.infer<typeof legacyAuthUserSchema>;

export const legacyLoginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
export type LegacyLoginRequest = z.infer<typeof legacyLoginRequestSchema>;

export const legacySignupRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  username: z.string().min(1),
});
export type LegacySignupRequest = z.infer<typeof legacySignupRequestSchema>;

export const legacyAuthSuccessSchema = z.object({
  user: legacyAuthUserSchema,
});
export type LegacyAuthSuccess = z.infer<typeof legacyAuthSuccessSchema>;

export const legacyMeResponseSchema = z.object({
  user: legacyAuthUserSchema,
});
export type LegacyMeResponse = z.infer<typeof legacyMeResponseSchema>;

export const legacyLogoutResponseSchema = z.object({
  message: z.string().min(1),
});
export type LegacyLogoutResponse = z.infer<typeof legacyLogoutResponseSchema>;

export const passwordLoginResponseSchema =
  createApiResponseSchema(authSessionPayloadSchema);
export const phoneOtpStartResponseSchema = createApiResponseSchema(
  z.object({ challengeId: z.string().min(1) })
);
export const phoneOtpVerifyResponseSchema =
  createApiResponseSchema(authSessionPayloadSchema);
export const googleLoginResponseSchema =
  createApiResponseSchema(authSessionPayloadSchema);
export const signupResponseSchema = createApiResponseSchema(
  authSessionPayloadSchema
);
export const meResponseSchema = createApiResponseSchema(
  authSessionPayloadSchema.nullable()
);
export const legacyLoginResponseSchema = legacyAuthSuccessSchema;
export const legacySignupResponseSchema = legacyAuthSuccessSchema;

export type PasswordLoginResponse = z.infer<typeof passwordLoginResponseSchema>;
export type PhoneOtpStartResponse = z.infer<typeof phoneOtpStartResponseSchema>;
export type PhoneOtpVerifyResponse = z.infer<typeof phoneOtpVerifyResponseSchema>;
export type GoogleLoginResponse = z.infer<typeof googleLoginResponseSchema>;
export type SignupResponse = z.infer<typeof signupResponseSchema>;
export type MeResponse = z.infer<typeof meResponseSchema>;
export type LegacyLoginResponse = z.infer<typeof legacyLoginResponseSchema>;
export type LegacySignupResponse = z.infer<typeof legacySignupResponseSchema>;
