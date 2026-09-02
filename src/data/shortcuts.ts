import { ShortcutItem } from '../types';

export const SHORTCUTS_DATA: ShortcutItem[] = [
  // Global & Navigation
  {
    id: 'global-search',
    keys: ['Ctrl', 'K'],
    macKeys: ['⌘', 'K'],
    description: 'باز کردن جستجوی سراسری و پالت دستورات هوشمند (Command Palette)',
    category: 'global',
    actionName: 'جستجوی سراسری',
    targetView: 'search'
  },
  {
    id: 'global-help',
    keys: ['?'],
    macKeys: ['?'],
    description: 'نمایش راهنمای جامع و تعاملی کلیدهای میانبر پلتفرم',
    category: 'global',
    actionName: 'راهنمای میانبرها'
  },
  {
    id: 'global-settings',
    keys: ['Ctrl', 'Shift', 'S'],
    macKeys: ['⌘', '⇧', 'S'],
    description: 'باز کردن پنجره تنظیمات، سفارشی‌سازی و مدیریت داده‌ها',
    category: 'global',
    actionName: 'تنظیمات سیستم'
  },
  {
    id: 'global-focus',
    keys: ['Ctrl', 'Shift', 'F'],
    macKeys: ['⌘', '⇧', 'F'],
    description: 'فعال یا غیرفعال‌سازی حالت تمرکز خالص (Distraction-Free Mode)',
    category: 'global',
    actionName: 'حالت تمرکز'
  },
  {
    id: 'global-esc',
    keys: ['Esc'],
    macKeys: ['Esc'],
    description: 'بستن سریع تمامی پنجره‌های مودال، دیالوگ‌ها و پالت‌های بازشو',
    category: 'global',
    actionName: 'بستن پنجره‌ها'
  },

  // Playground & Prompt Editor
  {
    id: 'pg-evaluate',
    keys: ['Ctrl', 'Enter'],
    macKeys: ['⌘', 'Enter'],
    description: 'اجرا و ارزیابی لحظه‌ای ساختار پرامپت در پزشک پرامپت (Prompt Doctor)',
    category: 'playground',
    actionName: 'تحلیل پرامپت',
    targetView: 'playground'
  },
  {
    id: 'pg-save',
    keys: ['Ctrl', 'S'],
    macKeys: ['⌘', 'S'],
    description: 'ذخیره پرامپت جاری در کتابخانه و دفترچه پرامپت‌های شخصی',
    category: 'playground',
    actionName: 'ذخیره پرامپت',
    targetView: 'playground'
  },
  {
    id: 'pg-improve',
    keys: ['Ctrl', 'Shift', 'I'],
    macKeys: ['⌘', '⇧', 'I'],
    description: 'بازنویسی، تقویت و ارتقای خودکار ساختار پرامپت (Auto-Improve)',
    category: 'playground',
    actionName: 'ارتقای خودکار',
    targetView: 'playground'
  },
  {
    id: 'pg-indent',
    keys: ['Tab'],
    macKeys: ['Tab'],
    description: 'درج تورفتگی استاندارد (۲ فاصله) در محیط ویرایشگر پرامپت',
    category: 'playground',
    actionName: 'درج ایندنت'
  },

  // Command Palette & Lists
  {
    id: 'palette-nav-vertical',
    keys: ['↑', '↓'],
    macKeys: ['↑', '↓'],
    description: 'حرکت به بالا و پایین در فهرست دستورات، درس‌ها و نتایج جستجو',
    category: 'palette',
    actionName: 'پیمایش فهرست'
  },
  {
    id: 'palette-select',
    keys: ['Enter'],
    macKeys: ['Enter'],
    description: 'انتخاب و اجرای دستور فعال یا باز کردن درس هایلایت‌شده',
    category: 'palette',
    actionName: 'انتخاب دستور'
  },
  {
    id: 'palette-cancel',
    keys: ['Esc'],
    macKeys: ['Esc'],
    description: 'لغو جستجو و بازگشت به صفحه قبلی',
    category: 'palette',
    actionName: 'لغو جستجو'
  },

  // Focus Lounge & Games
  {
    id: 'game-arrows',
    keys: ['↑', '↓', '←', '→'],
    macKeys: ['↑', '↓', '←', '→'],
    description: 'هدایت حرکت مار در Snake یا لغزش کاشی‌های عددی در ۲۰۴۸',
    category: 'games',
    actionName: 'کنترل حرکت بازی',
    targetView: 'lounge'
  },
  {
    id: 'game-pause',
    keys: ['Space'],
    macKeys: ['Space'],
    description: 'مکث موقت (Pause) یا ادامه بازی در اتاق استراحت هوشمند',
    category: 'games',
    actionName: 'مکث / ادامه بازی',
    targetView: 'lounge'
  },
  {
    id: 'game-restart',
    keys: ['R'],
    macKeys: ['R'],
    description: 'شروع مجدد دست جدید در مینی‌گیم‌های تمرکز',
    category: 'games',
    actionName: 'شروع مجدد دست',
    targetView: 'lounge'
  }
];

export const SHORTCUT_CATEGORIES = [
  { id: 'all', label: 'همه میانبرها', icon: 'Layers' },
  { id: 'global', label: 'عمومی و ناوبری', icon: 'Navigation' },
  { id: 'playground', label: 'کارگاه پرامپت', icon: 'Terminal' },
  { id: 'palette', label: 'پالت دستورات', icon: 'Search' },
  { id: 'games', label: 'اتاق استراحت و بازی‌ها', icon: 'Gamepad2' }
] as const;
