/**
 * User-provided LLM interface
 * 
 * The user supplies their own LLM implementation (OpenAI, Gemini, Claude, or custom)
 * llm-drift-ctl never owns LLM keys.
 */
export interface UserLLM {
  generate(input: {
    prompt: string;
    text?: string;
    json?: object;
  }): Promise<string | object>;
}

/**
 * DriftGuard configuration
 */
export interface DriftGuardConfig {
  pipelineId: string;
  llm?: UserLLM;
  cloudEndpoint?: string;
  apiKey?: string;
  contentRequirements?: string; // Optional: Requirements/conditions for content validation
}

/**
 * Check input
 */
export interface CheckInput {
  json?: object;
  text?: string;
  mode?: "FORMAT" | "CONTENT" | "CALIBRATION" | "ALL";
}

/**
 * Decision severity levels
 */
export type Severity = "LOW" | "MEDIUM" | "HIGH";

/**
 * Decision types
 */
export type Decision = "ALLOW" | "WARN" | "BLOCK";

/**
 * Drift detection location
 */
export interface DriftLocation {
  path: string;
  type: string;
}

/**
 * Check result - machine-readable decision
 */
export interface CheckResult {
  block: boolean;
  decision: Decision;
  severity: Severity;
  scores: {
    format?: number;
    semantic?: number;
    calibration?: number;
  };
  where: DriftLocation[];
}

/**
 * Baseline storage (normalized output + metadata)
 */
export interface Baseline {
  id: string;
  pipelineId: string;
  normalized: object | string;
  semanticFingerprint: string;
  scoreProfile: {
    format?: number;
    semantic?: number;
    calibration?: number;
  };
  createdAt: Date;
}

