import {
  BadgeCheck,
  BookOpen,
  ChartColumnIncreasing,
  CirclePlay,
  GraduationCap,
  Headphones,
  MicVocal,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Volume2,
} from 'lucide-react';

export const navigationLinks = [
  { label: 'خانه', href: '#home' },
  { label: 'ویژگی‌ها', href: '#features' },
  { label: 'دوره‌ها', href: '#audience' },
  { label: 'برای معلمان', href: '#learners' },
  { label: 'درباره ما', href: '#story' },
  { label: 'تماس با ما', href: '#contact' },
];

export const heroStats = [
  { label: 'واژه‌های فعال', value: '120+' },
  { label: 'سطوح تمرین', value: 'A1 تا C1' },
  { label: 'جلسه‌های کوتاه', value: '5 دقیقه‌ای' },
];

export const practiceLevels = ['A1','A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const features = [
  {
    title: 'تمرکز بر مهارت شنیدن',
    description: 'تمرین‌های واقعی با ساختارهای طبیعی برای تقویت درک شنیداری.',
    icon: Headphones,
    accent: 'from-[#dcead2] to-[#f5f8ef]',
  },
  {
    title: 'محتوای متنوع و کاربردی',
    description: 'داستان، مکالمه، اخبار ساده و موضوعات روزمره با جذابیت بیشتر.',
    icon: BookOpen,
    accent: 'from-[#f3ead6] to-[#fcf8ef]',
  },
  {
    title: 'پیگیری پیشرفت',
    description: 'گزارش دقت، خطاها و مسیر رشد شخصی‌سازی‌شده در یک نگاه.',
    icon: ChartColumnIncreasing,
    accent: 'from-[#e0ebdf] to-[#f6faf4]',
  },
  {
    title: 'برای معلمان و کلاس‌ها',
    description: 'ابزارهای حرفه‌ای برای مدیریت کلاس، تکلیف و ارزیابی دانش‌آموزان.',
    icon: Users,
    accent: 'from-[#f0e7dc] to-[#fdf9f2]',
  },
];

export const audiences = [
  {
    title: 'برای همه معلمان',
    description: 'ابزارهای آماده برای مدیریت کلاس، تکلیف و ارزیابی دانش‌آموزان.',
    icon: GraduationCap,
    tone: 'teacher',
  },
  {
    title: 'برای دانشجویان',
    description: 'تقویت مهارت شنیدن، افزایش اعتمادبه‌نفس و آمادگی برای امتحانات و مکالمه.',
    icon: MicVocal,
    tone: 'student',
  },
  {
    title: 'برای همه زبان‌آموزان',
    description: 'از مبتدی تا پیشرفته، مناسب هر سطح و هدف یادگیری.',
    icon: Sparkles,
    tone: 'learner',
  },
];

export const impactSteps = [
  {
    title: 'ایران سبزتر و آینده‌ای روشن‌تر',
    description: 'هر تمرین کوچک می‌تواند شروعی برای تغییر بزرگ‌تر باشد.',
    icon: Volume2,
  },
  {
    title: 'آموزش با کیفیت',
    description: 'یادگیری هدایت‌شده برای رشد مداوم و قابل‌سنجش.',
    icon: CirclePlay,
  },
  {
    title: 'دسترسی بهتر',
    description: 'محتوای مناسب برای رسیدن به تمرین‌های مفید و منظم.',
    icon: BadgeCheck,
  },
  {
    title: 'یادگیری پایدار',
    description: 'ترکیب تمرین، پیگیری و انگیزه برای حفظ پیشرفت.',
    icon: Target,
  },
  {
    title: 'اثر مثبت',
    description: 'آموختن بهتر، به رشد فردی و جمعی کمک می‌کند.',
    icon: ShieldCheck,
  },
];

export const supportPoints = [
  'محتوای کوتاه و هدفمند',
  'سطوح مشخص برای شروع سریع',
  'مناسب برای مرور شخصی یا کلاسی',
  'بازخورد شفاف و انگیزه‌بخش',
];

export const closingNotes = [
  'بدون نیاز به پیچیدگی',
  'مناسب برای تمرین روزانه',
  'طراحی گرم و دوست‌داشتنی',
];
