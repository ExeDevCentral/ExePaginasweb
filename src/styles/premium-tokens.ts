/**
 * Premium Adaptive UI Tokens for ExePaginasWeb SaaS Enterprise Design
 * Supports crisp human-readable contrast in BOTH Light Mode and Dark Mode.
 */

export const PREMIUM_TOKENS = {
  // Page Background Container (Adapts: #faf6f0 en Light, #030308 en Dark)
  bgMain:
    'min-h-screen relative bg-[#faf6f0] dark:bg-[#030308] text-[#2d212e] dark:text-slate-100 selection:bg-rose-500 selection:text-white transition-colors duration-300',

  // Glassmorphic Primary Card / Panel Container
  cardGlass:
    'relative rounded-3xl bg-[#fffaf5]/95 dark:bg-[#090a12]/95 border border-[#eee0d0] dark:border-white/15 backdrop-blur-2xl p-6 sm:p-8 shadow-xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden transition-colors duration-300',

  // Outer Glowing Border Wrap
  glowWrap:
    'relative p-[1px] rounded-[32px] bg-gradient-to-b from-rose-400/30 via-pink-400/20 to-amber-400/30 dark:from-cyan-500/40 dark:via-purple-500/20 dark:to-pink-500/40 shadow-lg dark:shadow-[0_0_60px_-15px_rgba(14,165,233,0.3)]',

  // SaaS Navigation Tabs Bar
  tabsBar:
    'mb-8 p-1.5 bg-[#f4e6ec]/90 dark:bg-[#090a12]/90 border border-[#eee0d0] dark:border-white/15 rounded-2xl backdrop-blur-2xl flex items-center gap-1.5 overflow-x-auto touch-pan-x shadow-md dark:shadow-lg scrollbar-none transition-colors duration-300',

  // Active Tab Pill Highlight
  activeTabGradient:
    'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 dark:from-cyan-500 dark:via-purple-600 dark:to-pink-500 text-white shadow-md dark:shadow-[0_4px_20px_rgba(168,85,247,0.35)] font-extrabold',

  // Inactive Tab Button
  inactiveTab:
    'text-[#7a5f78] dark:text-slate-300 hover:text-[#2d212e] dark:hover:text-white hover:bg-rose-200/50 dark:hover:bg-white/5 font-semibold transition-all',

  // Super Admin Control Container (Gold Glow)
  adminGoldAura:
    'relative p-[1px] rounded-3xl bg-gradient-to-r from-amber-500/40 via-yellow-500/30 to-amber-500/40 dark:from-amber-500/50 dark:via-yellow-500/30 dark:to-amber-500/50 shadow-md dark:shadow-[0_0_40px_rgba(245,158,11,0.15)] mb-8',

  // Primary CTA Button
  ctaButton:
    'w-full py-3.5 rounded-2xl font-black text-xs sm:text-sm tracking-wide uppercase transition-all bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 dark:from-cyan-500 dark:via-purple-600 dark:to-pink-500 hover:opacity-95 text-white shadow-md dark:shadow-[0_0_30px_rgba(168,85,247,0.4)] disabled:opacity-50 flex items-center justify-center gap-2',

  // SSL Badge
  sslBadge:
    'hidden sm:flex items-center gap-2 text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 backdrop-blur-xl px-4 py-1.5 rounded-full border border-emerald-300 dark:border-emerald-500/30 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.15)]',

  // Input Field Container
  inputWrap:
    'relative rounded-2xl border transition-all duration-200 bg-[#fffaf5] dark:bg-slate-950/80 border-[#eee0d0] dark:border-white/15 hover:border-rose-300 dark:hover:border-white/25 focus-within:border-rose-500 dark:focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-rose-500/20 text-[#2d212e] dark:text-white',

  // Text Color Tokens for Maximum Contrast
  textPrimary: 'text-[#2d212e] dark:text-white font-extrabold',
  textSecondary: 'text-[#5a4258] dark:text-slate-300 font-medium',
  textMuted: 'text-[#7a5f78] dark:text-slate-400 font-normal',
} as const
