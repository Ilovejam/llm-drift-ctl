import { Baseline } from "./types.js";

/**
 * In-memory baseline storage (MVP)
 * 
 * In production, this would be replaced with persistent storage
 */
class BaselineStore {
  private baselines: Map<string, Baseline[]> = new Map();

  /**
   * Store a baseline for a pipeline
   */
  store(baseline: Baseline): void {
    const existing = this.baselines.get(baseline.pipelineId) || [];
    existing.push(baseline);
    this.baselines.set(baseline.pipelineId, existing);
  }

  /**
   * Get all baselines for a pipeline
   */
  get(pipelineId: string): Baseline[] {
    return this.baselines.get(pipelineId) || [];
  }

  /**
   * Get the most recent baseline for a pipeline
   */
  getLatest(pipelineId: string): Baseline | null {
    const baselines = this.get(pipelineId);
    if (baselines.length === 0) return null;
    
    // Sort by createdAt descending
    return baselines.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    )[0];
  }

  /**
   * Clear all baselines for a pipeline
   */
  clear(pipelineId: string): void {
    this.baselines.delete(pipelineId);
  }
}

/**
 * Generate a simple semantic fingerprint (hash-like)
 * For MVP, we use a basic hash. In production, this would use proper semantic embedding.
 */
export function generateSemanticFingerprint(data: object | string): string {
  const str = typeof data === "string" ? data : JSON.stringify(data);
  // Simple hash for MVP
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Normalize output for baseline storage
 */
export function normalizeOutput(data: object | string): object | string {
  if (typeof data === "string") {
    return data.trim();
  }
  
  // Deep clone and sort keys for consistency
  return JSON.parse(JSON.stringify(data));
}

export const baselineStore = new BaselineStore();

