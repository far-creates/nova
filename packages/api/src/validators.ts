import {
  googleLoginRequestSchema,
  legacyLoginRequestSchema,
  legacyLoginResponseSchema,
  legacyLogoutResponseSchema,
  legacyMeResponseSchema,
  legacySignupRequestSchema,
  legacySignupResponseSchema,
  meResponseSchema,
  passwordLoginRequestSchema,
  passwordLoginResponseSchema,
  phoneOtpRequestStartSchema,
  phoneOtpRequestVerifySchema,
  phoneOtpStartResponseSchema,
  phoneOtpVerifyResponseSchema,
  signupRequestSchema,
  signupResponseSchema,
} from './auth';
import {
  attemptSubmissionRequestSchema,
  attemptSubmissionResponseSchema,
  legacyAttemptRequestSchema,
  legacyAttemptResponseSchema,
  practiceSessionEndRequestSchema,
  practiceSessionEndResponseSchema,
  practiceSessionStartRequestSchema,
  practiceSessionStartResponseSchema,
} from './attempts';
import {
  legacyProfileQueryInputSchema,
  legacyProfileQuerySchema,
  profileAttemptsQuerySchema,
  profileAttemptsResponseSchema,
  profileContributionResponseSchema,
  legacyProfileResponseSchema,
  profileSummaryResponseSchema,
} from './profile';
import {
  reviewQueueQuerySchema,
  reviewQueueResponseSchema,
} from './review';
import {
  legacyTrackListResponseSchema,
  randomTrackResponseSchema,
  topicListResponseSchema,
  trackListResponseSchema,
  trackQuerySchema,
} from './tracks';

export const authSchemas = {
  passwordLoginRequestSchema,
  passwordLoginResponseSchema,
  phoneOtpRequestStartSchema,
  phoneOtpRequestVerifySchema,
  phoneOtpStartResponseSchema,
  phoneOtpVerifyResponseSchema,
  googleLoginRequestSchema,
  signupRequestSchema,
  signupResponseSchema,
  meResponseSchema,
  legacyLoginRequestSchema,
  legacyLoginResponseSchema,
  legacySignupRequestSchema,
  legacySignupResponseSchema,
  legacyMeResponseSchema,
  legacyLogoutResponseSchema,
} as const;

export const attemptSchemas = {
  attemptSubmissionRequestSchema,
  attemptSubmissionResponseSchema,
  legacyAttemptRequestSchema,
  legacyAttemptResponseSchema,
  practiceSessionStartRequestSchema,
  practiceSessionStartResponseSchema,
  practiceSessionEndRequestSchema,
  practiceSessionEndResponseSchema,
} as const;

export const trackSchemas = {
  trackQuerySchema,
  legacyTrackListResponseSchema,
  randomTrackResponseSchema,
  trackListResponseSchema,
  topicListResponseSchema,
} as const;

export const profileSchemas = {
  legacyProfileResponseSchema,
  legacyProfileQuerySchema,
  legacyProfileQueryInputSchema,
  profileSummaryResponseSchema,
  profileAttemptsQuerySchema,
  profileAttemptsResponseSchema,
  profileContributionResponseSchema,
} as const;

export const reviewSchemas = {
  reviewQueueQuerySchema,
  reviewQueueResponseSchema,
} as const;
