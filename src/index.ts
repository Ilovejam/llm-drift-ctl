/**
 * llm-drift-ctl
 * 
 * Production-grade LLM output validation package.
 * Validates LLM outputs using your own LLM when needed — and no LLM when not.
 */

export { DriftGuard } from "./DriftGuard.js";
export { OpenAIAdapter } from "./adapters/OpenAIAdapter.js";
export type {
  UserLLM,
  DriftGuardConfig,
  CheckInput,
  CheckResult,
  Decision,
  Severity,
  DriftLocation,
  Baseline
} from "./types.js";

