import { DriftGuardConfig } from "./types.js";

/**
 * Cloud control plane client
 * 
 * Responsibilities:
 * - license verification
 * - feature flags (FORMAT vs CONTENT)
 * - usage tracking
 */

export interface LicenseResponse {
  valid: boolean;
  plan?: string;
  features?: string[];
}

/**
 * Verify license with cloud control plane
 */
export async function verifyLicense(
  config: DriftGuardConfig
): Promise<LicenseResponse> {
  const endpoint = config.cloudEndpoint || "https://llm-drift-ctl-cloud.fly.dev";
  const apiKey = config.apiKey;

  // FREE tier: FORMAT mode works offline, no API key needed
  if (!apiKey || apiKey === "free") {
    return {
      valid: true,
      plan: "free",
      features: ["FORMAT"]
    };
  }

  try {
    const response = await fetch(`${endpoint}/license/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ apiKey })
    });

    if (!response.ok) {
      return { valid: false };
    }

    return await response.json() as LicenseResponse;
  } catch (error) {
    // Network error - allow offline mode (FORMAT only)
    console.warn("Cloud license check failed, falling back to offline mode:", error);
    return {
      valid: true,
      plan: "offline",
      features: ["FORMAT"]
    };
  }
}

