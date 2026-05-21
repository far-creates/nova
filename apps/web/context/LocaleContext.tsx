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
      profile: 'Ù¾Ø±ÙˆÙØ§ÛŒÙ„',
      login: 'ÙˆØ±ÙˆØ¯',
      signup: 'Ø«Ø¨Øªâ€ŒÙ†Ø§Ù…',
      logout: 'Ø®Ø±ÙˆØ¬',
      loading: 'Ø¯Ø± Ø­Ø§Ù„ Ø¨Ø§Ø±Ú¯Ø°Ø§Ø±ÛŒ...',
    },
    header: {
      home: 'Ø®Ø§Ù†Ù‡',
      features: 'ÙˆÛŒÚ˜Ú¯ÛŒâ€ŒÙ‡Ø§',
      learners: 'Ø²Ø¨Ø§Ù†â€ŒØ¢Ù…ÙˆØ²Ø§Ù†',
      story: 'Ø¯Ø§Ø³ØªØ§Ù† Ù…Ø§',
      contact: 'ØªÙ…Ø§Ø³',
    },
    auth: {
      loginTag: 'ÙˆØ±ÙˆØ¯ Ù†ÙˆØ§',
      loginTitle: 'ÙˆØ±ÙˆØ¯ Ø¨Ù‡ Ø­Ø³Ø§Ø¨',
      loginDescription: 'Ø¨Ø±Ø§ÛŒ Ø§Ø¯Ø§Ù…Ù‡ ØªÙ…Ø±ÛŒÙ† Ø´Ù†ÛŒØ¯Ø§Ø±ÛŒØŒ ØªØ§Ø±ÛŒØ®Ú†Ù‡ Ùˆ Ù¾ÛŒØ´Ø±ÙØª Ø®ÙˆØ¯ ÙˆØ§Ø±Ø¯ Ø´ÙˆÛŒØ¯.',
      signupTag: 'Ø«Ø¨Øªâ€ŒÙ†Ø§Ù… Ù†ÙˆØ§',
      signupTitle: 'Ø³Ø§Ø®Øª Ø­Ø³Ø§Ø¨',
      signupDescription: 'Ø§Ø² Ù‡Ù…ÛŒÙ† Ø­Ø§Ù„Ø§ ØªÙ…Ø±ÛŒÙ†â€ŒÙ‡Ø§ÛŒ Ø®ÙˆØ¯ Ø±Ø§ Ø°Ø®ÛŒØ±Ù‡ Ú©Ù†ÛŒØ¯ Ùˆ Ø¨Ø¹Ø¯Ø§Ù‹ Ø±ÙˆØ´â€ŒÙ‡Ø§ÛŒ ÙˆØ±ÙˆØ¯ Ø¨ÛŒØ´ØªØ± Ø±Ø§ Ø§Ø¶Ø§ÙÙ‡ Ú©Ù†ÛŒÙ….',
      email: 'Ø§ÛŒÙ…ÛŒÙ„',
      password: 'Ø±Ù…Ø² Ø¹Ø¨ÙˆØ±',
      username: 'Ù†Ø§Ù… Ú©Ø§Ø±Ø¨Ø±ÛŒ',
      confirmPassword: 'ØªÚ©Ø±Ø§Ø± Ø±Ù…Ø² Ø¹Ø¨ÙˆØ±',
      passwordHelp: 'Ø­Ø¯Ø§Ù‚Ù„ Û¶ Ú©Ø§Ø±Ø§Ú©ØªØ±.',
      signin: 'ÙˆØ±ÙˆØ¯',
      signingIn: 'Ø¯Ø± Ø­Ø§Ù„ ÙˆØ±ÙˆØ¯...',
      createAccount: 'Ø«Ø¨Øªâ€ŒÙ†Ø§Ù…',
      creatingAccount: 'Ø¯Ø± Ø­Ø§Ù„ Ø³Ø§Ø®Øª Ø­Ø³Ø§Ø¨...',
      noAccount: 'Ø­Ø³Ø§Ø¨ Ù†Ø¯Ø§Ø±ÛŒØ¯ØŸ',
      hasAccount: 'Ù‚Ø¨Ù„Ø§Ù‹ Ø«Ø¨Øªâ€ŒÙ†Ø§Ù… Ú©Ø±Ø¯Ù‡â€ŒØ§ÛŒØ¯ØŸ',
    },
    landingPractice: {
      title: 'Ø¨Ø§ ÛŒÚ© Ø¬Ù…Ù„Ù‡ Ø´Ø±ÙˆØ¹ Ú©Ù†',
      description: 'ÛŒÚ© Ø¬Ù…Ù„Ù‡ ØªØµØ§Ø¯ÙÛŒ Ù¾Ø®Ø´ Ú©Ù†ØŒ Ú†ÛŒØ²ÛŒ Ø±Ø§ Ú©Ù‡ Ù…ÛŒâ€ŒØ´Ù†ÙˆÛŒ ØªØ§ÛŒÙ¾ Ú©Ù† Ùˆ Ù‡Ù…Ø§Ù† Ù„Ø­Ø¸Ù‡ Ø¨Ø§Ø²Ø®ÙˆØ±Ø¯ Ø¨Ú¯ÛŒØ±. Ù‡Ù…ÛŒÙ† Ø³Ø·Ø­ Ù…Ø´ØªØ±Ú© Ø¨Ø¹Ø¯Ø§Ù‹ Ø¨Ø±Ø§ÛŒ ØªÙ…Ø±ÛŒÙ† Ù…ÙˆØ¶ÙˆØ¹ÛŒ Ùˆ Ù…Ø±ÙˆØ± Ù‡Ù… Ø§Ø³ØªÙØ§Ø¯Ù‡ Ù…ÛŒâ€ŒØ´ÙˆØ¯.',
      nextSentence: 'Ø¬Ù…Ù„Ù‡ Ø¨Ø¹Ø¯ÛŒ',
      accent: 'Ù„Ù‡Ø¬Ù‡',
      accentHint: 'ÙÛŒÙ„ØªØ± Ù„Ù‡Ø¬Ù‡ Ùˆ Ù…ÙˆØ¶ÙˆØ¹ Ø¨Ø¹Ø¯Ø§Ù‹ Ø¨Ø¯ÙˆÙ† ØªØºÛŒÛŒØ± Ø¯Ø± Ù‡Ø³ØªÙ‡ ØªÙ…Ø±ÛŒÙ† Ø¨Ù‡ Ù‡Ù…ÛŒÙ† Ù…Ø§Ú˜ÙˆÙ„ ÙˆØµÙ„ Ù…ÛŒâ€ŒØ´ÙˆØ¯.',
      level: 'Ø³Ø·Ø­',
      chooseLevel: 'Ø³Ø·Ø­ Ø®ÙˆØ¯Øª Ø±Ø§ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†',
      levelSelected: (level) => `Ø³Ø·Ø­ ${level} Ø§Ù†ØªØ®Ø§Ø¨ Ø´Ø¯`,
      freshSentence: 'ÛŒÚ© ØªÙ…Ø±ÛŒÙ† ØªØ§Ø²Ù‡ Ø§Ù†ØªØ®Ø§Ø¨ Ø´Ø¯',
      checkedSaved: 'Ù¾Ø§Ø³Ø®Øª Ø¨Ø±Ø±Ø³ÛŒ Ùˆ Ø¯Ø± ØªØ§Ø±ÛŒØ®Ú†Ù‡ Ø°Ø®ÛŒØ±Ù‡ Ø´Ø¯.',
      checkedGuest: 'Ù¾Ø§Ø³Ø®Øª Ø¨Ø±Ø±Ø³ÛŒ Ø´Ø¯. Ø¨Ø±Ø§ÛŒ Ù†Ú¯Ù‡Ø¯Ø§Ø±ÛŒ Ø¨Ù„Ù†Ø¯Ù…Ø¯Øª ØªØ§Ø±ÛŒØ®Ú†Ù‡ Ø¨Ø¹Ø¯Ø§Ù‹ ÙˆØ§Ø±Ø¯ Ø­Ø³Ø§Ø¨ Ø´Ùˆ.',
      submitFailed: 'Ø§Ø±Ø³Ø§Ù„ Ø§Ù†Ø¬Ø§Ù… Ù†Ø´Ø¯. Ù„Ø·ÙØ§Ù‹ Ø¯ÙˆØ¨Ø§Ø±Ù‡ ØªÙ„Ø§Ø´ Ú©Ù†.',
    },
    practiceWorkspace: {
      badge: 'ØªÙ…Ø±ÛŒÙ† Ø´Ù†ÛŒØ¯Ø§Ø±ÛŒ',
      currentTrack: 'Ø¬Ù…Ù„Ù‡ ÙØ¹Ù„ÛŒ',
      pickTrack: 'Ø¨Ø±Ø§ÛŒ Ø´Ø±ÙˆØ¹ ÛŒÚ© Ø¬Ù…Ù„Ù‡ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†.',
      typeWhatYouHear: 'Ù‡Ø±Ú†Ù‡ Ù…ÛŒâ€ŒØ´Ù†ÙˆÛŒ ØªØ§ÛŒÙ¾ Ú©Ù†',
      inputHelp: 'Ø§Ø² Ú©Ù†ØªØ±Ù„â€ŒÙ‡Ø§ÛŒ Ù¾Ø®Ø´ Ø¨Ø§Ù„Ø§ Ø§Ø³ØªÙØ§Ø¯Ù‡ Ú©Ù† Ùˆ Ø¬Ù…Ù„Ù‡ Ø±Ø§ ØªØ§ Ø­Ø¯ Ù…Ù…Ú©Ù† Ø¯Ù‚ÛŒÙ‚ ØªØ§ÛŒÙ¾ Ú©Ù†.',
      inputPlaceholder: 'Ù…ØªÙ† Ø´Ù†ÛŒØ¯Ù‡â€ŒØ´Ø¯Ù‡ Ø±Ø§ Ø§ÛŒÙ†Ø¬Ø§ Ø¨Ù†ÙˆÛŒØ³...',
      feedback: 'Ø¨Ø§Ø²Ø®ÙˆØ±Ø¯',
      result: 'Ù†ØªÛŒØ¬Ù‡ Ø´Ù…Ø§',
      accuracy: 'Ø¯Ù‚Øª',
      wrong: 'Ø§Ø´ØªØ¨Ø§Ù‡',
      extra: 'Ø§Ø¶Ø§ÙÛŒ',
      correctChars: 'Ú©Ø§Ø±Ø§Ú©ØªØ±Ù‡Ø§ÛŒ Ø¯Ø±Ø³Øª',
      wrongChars: 'Ú©Ø§Ø±Ø§Ú©ØªØ±Ù‡Ø§ÛŒ Ø§Ø´ØªØ¨Ø§Ù‡',
      extraChars: 'Ú©Ø§Ø±Ø§Ú©ØªØ±Ù‡Ø§ÛŒ Ø§Ø¶Ø§ÙÛŒ',
      firstMistakes: 'Ø§ÙˆÙ„ÛŒÙ† Ù…ÙˆÙ‚Ø¹ÛŒØªâ€ŒÙ‡Ø§ÛŒ Ø§Ø´ØªØ¨Ø§Ù‡',
      expectedGot: (index, expected, got) => `Ù…ÙˆÙ‚Ø¹ÛŒØª ${index}: Ø¨Ù‡â€ŒØ¬Ø§ÛŒ Â«${got}Â» Ø¨Ø§ÛŒØ¯ Â«${expected}Â» Ø¨Ø§Ø´Ø¯`,
      emptyResult: 'Ø¨Ø¹Ø¯ Ø§Ø² Ø§Ø±Ø³Ø§Ù„ Ù¾Ø§Ø³Ø®ØŒ Ù†ØªÛŒØ¬Ù‡ØŒ Ø¯Ù‚Øª Ùˆ Ø®Ù„Ø§ØµÙ‡ Ø®Ø·Ø§Ù‡Ø§ Ø§ÛŒÙ†Ø¬Ø§ Ù†Ù…Ø§ÛŒØ´ Ø¯Ø§Ø¯Ù‡ Ù…ÛŒâ€ŒØ´ÙˆØ¯.',
      ready: 'Ø¢Ù…Ø§Ø¯Ù‡',
      idle: 'Ø¨ÛŒâ€ŒØµØ¯Ø§',
      playing: 'Ø¯Ø± Ø­Ø§Ù„ Ù¾Ø®Ø´',
      paused: 'Ù…ØªÙˆÙ‚Ù',
      noTrack: 'Ø¨Ø¯ÙˆÙ† Ø¬Ù…Ù„Ù‡',
    },
    practicePage: {
      tag: 'Ø­Ø§Ù„Øª ØªÙ…Ø±ÛŒÙ†',
      title: 'Ø¨Ø´Ù†Ùˆ Ùˆ ØªØ§ÛŒÙ¾ Ú©Ù†',
      description: (username) => `${username} Ø®ÙˆØ´ Ø¢Ù…Ø¯ÛŒ. ÛŒÚ© Ø¬Ù…Ù„Ù‡ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†ØŒ Ø¨Ø§ Ø¯Ù‚Øª Ú¯ÙˆØ´ Ø¨Ø¯Ù‡ Ùˆ Ø¯Ù‚ØªØª Ø±Ø§ Ø¯Ø± Ú¯Ø°Ø± Ø²Ù…Ø§Ù† Ø¯Ù†Ø¨Ø§Ù„ Ú©Ù†.`,
      workspaceTitle: 'ØªÙ…Ø±ÛŒÙ† Ø³Ø§Ø®ØªØ§Ø±ÛŒØ§ÙØªÙ‡ Ø¬Ù…Ù„Ù‡',
      workspaceDescription: 'Ø§ÛŒÙ† Ù‡Ù…Ø§Ù† ÙØ¶Ø§ÛŒ Ù…Ø´ØªØ±Ú© ØªÙ…Ø±ÛŒÙ† Ø¯Ø± Ù„Ù†Ø¯ÛŒÙ†Ú¯ Ø§Ø³Øª Ú©Ù‡ Ø­Ø§Ù„Ø§ Ø¨Ù‡ ÙÙ‡Ø±Ø³Øª Ø¬Ù…Ù„Ø§Øª Ùˆ Ø°Ø®ÛŒØ±Ù‡ Ø¯Ø± ØªØ§Ø±ÛŒØ®Ú†Ù‡ ÙˆØµÙ„ Ø´Ø¯Ù‡ Ø§Ø³Øª.',
      trackLibrary: 'Ú©ØªØ§Ø¨Ø®Ø§Ù†Ù‡ Ø¬Ù…Ù„Ø§Øª',
      chooseSentence: 'ÛŒÚ© Ø¬Ù…Ù„Ù‡ Ø§Ù†ØªØ®Ø§Ø¨ Ú©Ù†',
      loadTracksFailed: 'Ø¨Ø§Ø±Ú¯Ø°Ø§Ø±ÛŒ Ø¬Ù…Ù„Ø§Øª Ù…Ù…Ú©Ù† Ù†Ø´Ø¯.',
      saveAttempt: 'Ø°Ø®ÛŒØ±Ù‡ ØªÙ„Ø§Ø´',
      savingAttempt: 'Ø¯Ø± Ø­Ø§Ù„ Ø°Ø®ÛŒØ±Ù‡...',
      attemptSaved: 'ØªÙ„Ø§Ø´ Ø¯Ø± ØªØ§Ø±ÛŒØ®Ú†Ù‡ Ø°Ø®ÛŒØ±Ù‡ Ø´Ø¯.',
      answerChecked: 'Ù¾Ø§Ø³Ø® Ø¨Ø±Ø±Ø³ÛŒ Ø´Ø¯.',
      saveFailed: 'Ø°Ø®ÛŒØ±Ù‡ ØªÙ„Ø§Ø´ Ø§Ù†Ø¬Ø§Ù… Ù†Ø´Ø¯.',
      checkFailed: 'Ø¨Ø±Ø±Ø³ÛŒ Ù¾Ø§Ø³Ø® Ø§Ù†Ø¬Ø§Ù… Ù†Ø´Ø¯.',
      checkAnswer: 'Ø¨Ø±Ø±Ø³ÛŒ Ù¾Ø§Ø³Ø®',
      checkingAnswer: 'Ø¯Ø± Ø­Ø§Ù„ Ø¨Ø±Ø±Ø³ÛŒ...',
    },
  },
  en: {
    common: {
      localeLabel: 'EN',
      switchLocale: 'ÙØ§Ø±Ø³ÛŒ',
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
      noAccount: 'Donâ€™t have an account?',
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
