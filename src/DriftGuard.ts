import {
  DriftGuardConfig,
  CheckInput,
  CheckResult,
  UserLLM,
  Baseline,
  Decision,
  Severity
} from "./types.js";
import { checkJsonFormat, parseAndValidateJson } from "./format.js";
import {
  baselineStore,
  generateSemanticFingerprint,
  normalizeOutput
} from "./baseline.js";
import { verifyLicense } from "./cloud.js";
import { checkContentDrift } from "./content.js";

/**
 * DriftGuard - Main class for LLM output validation
 * 
 * This class validates LLM outputs after they are produced.
 * It never generates content, modifies prompts, or fixes outputs.
 * It only returns: ALLOW, WARN, or BLOCK decisions.
 */
export class DriftGuard {
  private config: DriftGuardConfig;
  private licenseCache: { valid: boolean; features: string[] } | null = null;

  constructor(config: DriftGuardConfig) {
    if (!config.pipelineId) {
      throw new Error("pipelineId is required");
    }
    this.config = config;
  }

  /**
   * Run validation check on output
   * 
   * Returns machine-readable decision (ALLOW, WARN, BLOCK)
   */
  async check(input: CheckInput): Promise<CheckResult> {
    const { json, text, mode = "FORMAT" } = input;

    // Determine what to check
    const modes = mode === "ALL" 
      ? ["FORMAT", "CONTENT", "CALIBRATION"] 
      : [mode];

    const result: CheckResult = {
      block: false,
      decision: "ALLOW",
      severity: "LOW",
      scores: {},
      where: []
    };

    // FORMAT mode checks (always available, offline)
    if (modes.includes("FORMAT")) {
      const formatResult = await this.checkFormat(json, text);
      result.scores.format = formatResult.score;
      result.where.push(...formatResult.errors);

      if (!formatResult.valid) {
        result.block = true;
        result.decision = "BLOCK";
        result.severity = "HIGH";
      }
    }

    // CONTENT/CALIBRATION mode checks (require LLM and license)
    if (modes.includes("CONTENT") || modes.includes("CALIBRATION")) {
      const license = await this.ensureLicense();
      
      if (!license.valid || !license.features?.includes("CONTENT")) {
        throw new Error(
          "CONTENT/CALIBRATION mode requires valid license with CONTENT feature"
        );
      }

      if (!this.config.llm) {
        throw new Error("CONTENT/CALIBRATION mode requires UserLLM to be provided");
      }

      const contentResult = await this.checkContent(json, text);
      if (modes.includes("CONTENT")) {
        result.scores.semantic = contentResult.semantic;
      }
      if (modes.includes("CALIBRATION") || modes.includes("CONTENT")) {
        result.scores.calibration = contentResult.calibration;
      }

      // Update decision based on content checks
      if (contentResult.block) {
        result.block = true;
        result.decision = "BLOCK";
        result.severity = "HIGH";
      } else if (contentResult.warn) {
        if (result.decision === "ALLOW") {
          result.decision = "WARN";
          result.severity = "MEDIUM";
        }
      }
    }

    return result;
  }

  /**
   * Accept output as baseline (approved behavior)
   */
  async acceptBaseline(input: { json?: object; text?: string }): Promise<void> {
    const { json, text } = input;

    if (!json && !text) {
      throw new Error("Either json or text must be provided");
    }

    const normalized = normalizeOutput(json || text!);
    const fingerprint = generateSemanticFingerprint(normalized);

    const baseline: Baseline = {
      id: `${this.config.pipelineId}-${Date.now()}`,
      pipelineId: this.config.pipelineId,
      normalized,
      semanticFingerprint: fingerprint,
      scoreProfile: {
        format: json ? 1.0 : undefined
      },
      createdAt: new Date()
    };

    baselineStore.store(baseline);
  }

  /**
   * FORMAT mode checks (offline, LLM-free)
   */
  private async checkFormat(
    json?: object,
    text?: string
  ): Promise<{ valid: boolean; score: number; errors: Array<{ path: string; type: string }> }> {
    if (json) {
      return checkJsonFormat(json);
    } else if (text) {
      return parseAndValidateJson(text);
    } else {
      return {
        valid: false,
        score: 0.0,
        errors: [{ path: "root", type: "no_input" }]
      };
    }
  }

  /**
   * CONTENT/CALIBRATION mode checks (require LLM)
   */
  private async checkContent(
    json?: object,
    text?: string
  ): Promise<{ semantic: number; calibration: number; block: boolean; warn: boolean }> {
    const llm = this.config.llm!;
    
    // Get latest baseline for comparison
    const baseline = baselineStore.getLatest(this.config.pipelineId);
    
    if (!baseline) {
      // No baseline yet - allow but warn
      return {
        semantic: 1.0,
        calibration: 1.0,
        block: false,
        warn: true
      };
    }

    // Use LLM to check content drift
    const currentOutput = json || text || "";
    const result = await checkContentDrift(
      llm,
      baseline,
      currentOutput,
      this.config.contentRequirements // Optional requirements/conditions
    );

    return {
      semantic: result.semantic,
      calibration: result.calibration,
      block: result.block,
      warn: result.warn
    };
  }

  /**
   * Ensure license is valid (with caching)
   */
  private async ensureLicense(): Promise<{ valid: boolean; features: string[] }> {
    if (this.licenseCache) {
      return this.licenseCache;
    }

    const license = await verifyLicense(this.config);
    
    this.licenseCache = {
      valid: license.valid,
      features: license.features || ["FORMAT"]
    };

    return this.licenseCache;
  }
}

