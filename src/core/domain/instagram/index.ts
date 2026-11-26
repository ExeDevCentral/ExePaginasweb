/**
 * © 2025 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 *
 * Interfaz Pública Compacta (Deep Module) — Instagram Editorial & Humanizer Engine
 */
export { HOOK_FORMULAS, classifyHookFormula, type HookFormula } from './hookFormulas'
export {
  scoreReelHook,
  buildBeatSheet,
  lintInstagramCaption,
  humanizeDraft,
  detectMachineSignals,
  type HookScoreReport,
  type HookCheckKey,
  type BeatSheetReport,
  type BeatRow,
  type CaptionLintReport,
  type CaptionLintCheck,
  type HumanizeResult,
  type HumanizeReport,
  type DetectionReport,
  type DetectionCheckKey,
} from './instagramLinter'
