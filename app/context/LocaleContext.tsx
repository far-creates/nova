'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AppLocale = 'fa' | 'en';

type LocaleMessages = {
  common: {
    localeLabel: string;
    switchLocale: string;
    profile: string;
    login: string;
    signup: string;
    logout: string;
    loading: string;
  };
  header: {
    home: string;
    features: string;
    learners: string;
    story: string;
    contact: string;
  };
  auth: {
    loginTag: string;
    loginTitle: string;
    loginDescription: string;
    signupTag: string;
    signupTitle: string;
    signupDescription: string;
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
    passwordHelp: string;
    signin: string;
    signingIn: string;
    createAccount: string;
    creatingAccount: string;
    noAccount: string;
    hasAccount: string;
  };
  landingPractice: {
    title: string;
    description: string;
    nextSentence: string;
    accent: string;
    accentHint: string;
    level: string;
    chooseLevel: string;
    levelSelected: (level: string) => string;
    freshSentence: string;
    checkedSaved: string;
    checkedGuest: string;
    submitFailed: string;
  };
  practiceWorkspace: {
    badge: string;
    currentTrack: string;
    pickTrack: string;
    typeWhatYouHear: string;
    inputHelp: string;
    inputPlaceholder: string;
    feedback: string;
    result: string;
    accuracy: string;
    wrong: string;
    extra: string;
    correctChars: string;
    wrongChars: string;
    extraChars: string;
    firstMistakes: string;
      expectedGot: (index: number, expected: string, got: string) => string;
      emptyResult: string;
      ready: string;
      idle: string;
      playing: string;
      paused: string;
      noTrack: string;
  };
  practicePage: {
    tag: string;
    title: string;
    description: (username: string) => string;
    workspaceTitle: string;
    workspaceDescription: string;
    trackLibrary: string;
    chooseSentence: string;
    loadTracksFailed: string;
    saveAttempt: string;
    savingAttempt: string;
    attemptSaved: string;
    answerChecked: string;
    saveFailed: string;
    checkFailed: string;
    checkAnswer: string;
    checkingAnswer: string;
  };
};

const messages: Record<AppLocale, LocaleMessages> = {
  fa: {
    common: {
      localeLabel: 'FA',
      switchLocale: 'English',
      profile: 'پروفایل',
      login: 'ورود',
      signup: 'ثبت‌نام',
      logout: 'خروج',
      loading: 'در حال بارگذاری...',
    },
    header: {
      home: 'خانه',
      features: 'ویژگی‌ها',
      learners: 'زبان‌آموزان',
      story: 'داستان ما',
      contact: 'تماس',
    },
    auth: {
      loginTag: 'ورود نوا',
      loginTitle: 'ورود به حساب',
      loginDescription: 'برای ادامه تمرین شنیداری، تاریخچه و پیشرفت خود وارد شوید.',
      signupTag: 'ثبت‌نام نوا',
      signupTitle: 'ساخت حساب',
      signupDescription: 'از همین حالا تمرین‌های خود را ذخیره کنید و بعداً روش‌های ورود بیشتر را اضافه کنیم.',
      email: 'ایمیل',
      password: 'رمز عبور',
      username: 'نام کاربری',
      confirmPassword: 'تکرار رمز عبور',
      passwordHelp: 'حداقل ۶ کاراکتر.',
      signin: 'ورود',
      signingIn: 'در حال ورود...',
      createAccount: 'ثبت‌نام',
      creatingAccount: 'در حال ساخت حساب...',
      noAccount: 'حساب ندارید؟',
      hasAccount: 'قبلاً ثبت‌نام کرده‌اید؟',
    },
    landingPractice: {
      title: 'با یک جمله شروع کن',
      description: 'یک جمله تصادفی پخش کن، چیزی را که می‌شنوی تایپ کن و همان لحظه بازخورد بگیر. همین سطح مشترک بعداً برای تمرین موضوعی و مرور هم استفاده می‌شود.',
      nextSentence: 'جمله بعدی',
      accent: 'لهجه',
      accentHint: 'فیلتر لهجه و موضوع بعداً بدون تغییر در هسته تمرین به همین ماژول وصل می‌شود.',
      level: 'سطح',
      chooseLevel: 'سطح خودت را انتخاب کن',
      levelSelected: (level) => `سطح ${level} انتخاب شد`,
      freshSentence: 'یک تمرین تازه انتخاب شد',
      checkedSaved: 'پاسخت بررسی و در تاریخچه ذخیره شد.',
      checkedGuest: 'پاسخت بررسی شد. برای نگهداری بلندمدت تاریخچه بعداً وارد حساب شو.',
      submitFailed: 'ارسال انجام نشد. لطفاً دوباره تلاش کن.',
    },
    practiceWorkspace: {
      badge: 'تمرین شنیداری',
      currentTrack: 'جمله فعلی',
      pickTrack: 'برای شروع یک جمله انتخاب کن.',
      typeWhatYouHear: 'هرچه می‌شنوی تایپ کن',
      inputHelp: 'از کنترل‌های پخش بالا استفاده کن و جمله را تا حد ممکن دقیق تایپ کن.',
      inputPlaceholder: 'متن شنیده‌شده را اینجا بنویس...',
      feedback: 'بازخورد',
      result: 'نتیجه شما',
      accuracy: 'دقت',
      wrong: 'اشتباه',
      extra: 'اضافی',
      correctChars: 'کاراکترهای درست',
      wrongChars: 'کاراکترهای اشتباه',
      extraChars: 'کاراکترهای اضافی',
      firstMistakes: 'اولین موقعیت‌های اشتباه',
      expectedGot: (index, expected, got) => `موقعیت ${index}: به‌جای «${got}» باید «${expected}» باشد`,
      emptyResult: 'بعد از ارسال پاسخ، نتیجه، دقت و خلاصه خطاها اینجا نمایش داده می‌شود.',
      ready: 'آماده',
      idle: 'بی‌صدا',
      playing: 'در حال پخش',
      paused: 'متوقف',
      noTrack: 'بدون جمله',
    },
    practicePage: {
      tag: 'حالت تمرین',
      title: 'بشنو و تایپ کن',
      description: (username) => `${username} خوش آمدی. یک جمله انتخاب کن، با دقت گوش بده و دقتت را در گذر زمان دنبال کن.`,
      workspaceTitle: 'تمرین ساختاریافته جمله',
      workspaceDescription: 'این همان فضای مشترک تمرین در لندینگ است که حالا به فهرست جملات و ذخیره در تاریخچه وصل شده است.',
      trackLibrary: 'کتابخانه جملات',
      chooseSentence: 'یک جمله انتخاب کن',
      loadTracksFailed: 'بارگذاری جملات ممکن نشد.',
      saveAttempt: 'ذخیره تلاش',
      savingAttempt: 'در حال ذخیره...',
      attemptSaved: 'تلاش در تاریخچه ذخیره شد.',
      answerChecked: 'پاسخ بررسی شد.',
      saveFailed: 'ذخیره تلاش انجام نشد.',
      checkFailed: 'بررسی پاسخ انجام نشد.',
      checkAnswer: 'بررسی پاسخ',
      checkingAnswer: 'در حال بررسی...',
    },
  },
  en: {
    common: {
      localeLabel: 'EN',
      switchLocale: 'فارسی',
      profile: 'Profile',
      login: 'Login',
      signup: 'Sign up',
      logout: 'Logout',
      loading: 'Loading...',
    },
    header: {
      home: 'Home',
      features: 'Features',
      learners: 'Learners',
      story: 'Our story',
      contact: 'Contact',
    },
    auth: {
      loginTag: 'Nova Login',
      loginTitle: 'Sign in to your account',
      loginDescription: 'Continue your listening practice, saved attempts, and progress history.',
      signupTag: 'Nova Signup',
      signupTitle: 'Create your account',
      signupDescription: 'Save practice history now, and leave room for more sign-in methods later.',
      email: 'Email',
      password: 'Password',
      username: 'Username',
      confirmPassword: 'Confirm password',
      passwordHelp: 'Minimum 6 characters.',
      signin: 'Sign in',
      signingIn: 'Signing in...',
      createAccount: 'Sign up',
      creatingAccount: 'Creating account...',
      noAccount: 'Don’t have an account?',
      hasAccount: 'Already have an account?',
    },
    landingPractice: {
      title: 'Start with one sentence',
      description: 'Play a random sentence, type what you hear, and get instant listening feedback. This shared surface will also support topic sessions and review sessions.',
      nextSentence: 'Next sentence',
      accent: 'Accent',
      accentHint: 'Accent and topic filters will plug into this same module later without changing the main practice workspace.',
      level: 'Level',
      chooseLevel: 'Choose your level',
      levelSelected: (level) => `Level ${level} selected`,
      freshSentence: 'A fresh practice sentence was selected.',
      checkedSaved: 'Your answer was checked and saved to history.',
      checkedGuest: 'Your answer was checked. Sign in later if you want long-term progress history.',
      submitFailed: 'Submission failed. Please try again.',
    },
    practiceWorkspace: {
      badge: 'Listening Practice',
      currentTrack: 'Current track',
      pickTrack: 'Pick a track to start practicing.',
      typeWhatYouHear: 'Type what you hear',
      inputHelp: 'Use the audio controls above, then type the sentence as accurately as you can.',
      inputPlaceholder: 'Type what you heard...',
      feedback: 'Feedback',
      result: 'Your result',
      accuracy: 'Accuracy',
      wrong: 'Wrong',
      extra: 'Extra',
      correctChars: 'Correct characters',
      wrongChars: 'Wrong characters',
      extraChars: 'Extra characters',
      firstMistakes: 'First mistake positions',
      expectedGot: (index, expected, got) => `Position ${index}: expected "${expected}" got "${got}"`,
      emptyResult: 'Your correction, accuracy, and error summary will appear here after you submit an attempt.',
      ready: 'Ready',
      idle: 'Idle',
      playing: 'Playing',
      paused: 'Paused',
      noTrack: 'No track',
    },
    practicePage: {
      tag: 'Practice Mode',
      title: 'Listen and type',
      description: (username) => `Welcome back, ${username}. Pick a sentence, listen carefully, and track your accuracy over time.`,
      workspaceTitle: 'Structured sentence practice',
      workspaceDescription: 'This is the same core workspace used on the landing page, now paired with an authenticated track library and save-to-history actions.',
      trackLibrary: 'Track library',
      chooseSentence: 'Choose a sentence',
      loadTracksFailed: 'Could not load tracks.',
      saveAttempt: 'Save attempt',
      savingAttempt: 'Saving...',
      attemptSaved: 'Attempt saved to your history.',
      answerChecked: 'Answer checked.',
      saveFailed: 'Could not save attempt.',
      checkFailed: 'Could not check answer.',
      checkAnswer: 'Check answer',
      checkingAnswer: 'Checking...',
    },
  },
};

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
  dir: 'rtl' | 'ltr';
  messages: LocaleMessages;
};

const STORAGE_KEY = 'nova-locale';

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(() => {
    if (typeof window === 'undefined') {
      return 'fa';
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'fa' || stored === 'en' ? stored : 'fa';
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    const dir = locale === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.body.classList.toggle('font-ui-en', locale === 'en');
  }, [locale]);

  const value = useMemo<LocaleContextValue>(() => {
    const dir = locale === 'fa' ? 'rtl' : 'ltr';
    return {
      locale,
      setLocale: setLocaleState,
      toggleLocale: () => setLocaleState((current) => (current === 'fa' ? 'en' : 'fa')),
      dir,
      messages: messages[locale],
    };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}
