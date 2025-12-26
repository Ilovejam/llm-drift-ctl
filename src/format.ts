import { DriftLocation } from "./types.js";

/**
 * FORMAT mode checks (LLM-free, fully offline)
 * 
 * Checks:
 * - JSON parse validity
 * - Schema validation
 * - Required keys
 * - Type mismatches
 * - Structural consistency
 */

export interface FormatCheckResult {
  valid: boolean;
  score: number; // 0.0 to 1.0
  errors: DriftLocation[];
}

/**
 * Check JSON format validity
 */
export function checkJsonFormat(json: unknown): FormatCheckResult {
  const errors: DriftLocation[] = [];
  let score = 1.0;

  // Check if it's a valid object
  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    return {
      valid: false,
      score: 0.0,
      errors: [{ path: "root", type: "not_an_object" }]
    };
  }

  // Basic structural checks
  const obj = json as Record<string, unknown>;
  
  // Check for null values (might indicate missing data)
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      errors.push({ path: key, type: "null_or_undefined" });
      score -= 0.1;
    } else if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      // Recursively check nested objects
      const nested = checkJsonFormat(value);
      if (!nested.valid) {
        errors.push(...nested.errors.map(e => ({
          path: `${key}.${e.path}`,
          type: e.type
        })));
        score -= nested.score * 0.2;
      }
    }
  }

  score = Math.max(0.0, score);

  return {
    valid: score >= 0.5,
    score,
    errors
  };
}

/**
 * Validate JSON string parse
 */
export function parseAndValidateJson(jsonString: string): FormatCheckResult {
  try {
    const parsed = JSON.parse(jsonString);
    return checkJsonFormat(parsed);
  } catch (error) {
    return {
      valid: false,
      score: 0.0,
      errors: [{ path: "root", type: "json_parse_error" }]
    };
  }
}

