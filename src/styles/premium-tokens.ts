/**
 * Dashdark X Luxury SaaS Enterprise UI Tokens
 * Direct 1:1 match with the Dashdark X dark-navy aesthetic, cards, metrics & charts.
 */

export const PREMIUM_TOKENS = {
  // Page Canvas Background (Dashdark X deep midnight slate)
  bgMain:
    'min-h-screen relative bg-[#0B0E14] text-slate-100 selection:bg-[#4361EE] selection:text-white font-sans antialiased',

  // Dashdark X Sidebar Background
  sidebarBg:
    'w-64 shrink-0 bg-[#0D111A] border-r border-[#1E2638] flex flex-col justify-between p-5 min-h-screen',

  // Dashdark X Primary Surface Card
  cardGlass:
    'relative rounded-2xl bg-[#111622] border border-[#1E2638] p-6 shadow-sm overflow-hidden text-slate-100 transition-all',

  // Dashdark X Sub-Card / Inner Box
  subCard: 'rounded-xl bg-[#151B28] border border-[#1E2638] p-4 text-slate-200 transition-all',

  // Outer Glowing Wrap
  glowWrap:
    'relative p-[1px] rounded-2xl bg-gradient-to-b from-[#4361EE]/30 via-[#06B6D4]/15 to-transparent shadow-[0_0_40px_rgba(67,97,238,0.12)]',

  // Dashdark X Navigation Tabs Bar
  tabsBar:
    'mb-6 p-1.5 bg-[#0D111A] border border-[#1E2638] rounded-xl flex items-center gap-1.5 overflow-x-auto touch-pan-x scrollbar-none shadow-sm',

  // Active Tab Pill
  activeTabGradient: 'bg-[#1C2438] border border-[#4361EE]/40 text-white font-semibold shadow-sm',

  // Inactive Tab Button
  inactiveTab: 'text-[#8C9BB0] hover:text-white hover:bg-[#151B28] font-medium transition-all',

  // Super Admin Bar
  adminGoldAura:
    'relative p-[1px] rounded-2xl bg-gradient-to-r from-amber-500/40 via-yellow-500/30 to-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] mb-6',

  // Primary Action Button (Dashdark X Royal Blue)
  ctaButton:
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-[#4361EE] hover:bg-[#3854E0] text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer',

  // Secondary Action Button (Dashdark X Dark Slate Outline)
  btnSecondary:
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-[#151B28] hover:bg-[#1C2438] text-slate-300 border border-[#1E2638] transition-all cursor-pointer',

  // SSL Badge
  sslBadge:
    'hidden sm:flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-sm',

  // Input Field Container
  inputWrap:
    'relative rounded-xl border border-[#1E2638] bg-[#151B28] text-slate-200 placeholder:text-[#64748B] focus-within:border-[#4361EE] focus-within:ring-1 focus-within:ring-[#4361EE] transition-all text-sm',

  // Text Color Tokens
  textPrimary: 'text-white font-bold',
  textSecondary: 'text-[#8C9BB0] font-normal',
  textMuted: 'text-[#64748B] font-normal',

  // Badges
  badgeGreen:
    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5 rounded-md font-semibold inline-flex items-center gap-1',
  badgeRed:
    'bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2 py-0.5 rounded-md font-semibold inline-flex items-center gap-1',
  badgeBlue:
    'bg-[#4361EE]/15 text-[#60A5FA] border border-[#4361EE]/30 text-xs px-2 py-0.5 rounded-md font-semibold inline-flex items-center gap-1',
} as const
