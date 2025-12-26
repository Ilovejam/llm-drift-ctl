import { UserLLM } from "./types.js";
import { Baseline } from "./types.js";
import { baselineStore } from "./baseline.js";

/**
 * CONTENT mode drift detection
 * 
 * Uses LLM to compare new output against baseline
 * and detect content drift
 */

export interface ContentCheckResult {
  semantic: number; // 0.0 to 1.0
  calibration: number; // 0.0 to 1.0
  block: boolean;
  warn: boolean;
  details?: {
    driftPoints?: string[];
    differences?: string[];
  };
}

/**
 * Check content drift using LLM comparison
 */
export async function checkContentDrift(
  llm: UserLLM,
  baseline: Baseline,
  currentOutput: object | string,
  requirements?: string
): Promise<ContentCheckResult> {
  
  const baselineStr = typeof baseline.normalized === "string" 
    ? baseline.normalized 
    : JSON.stringify(baseline.normalized, null, 2);
    
  const currentStr = typeof currentOutput === "string"
    ? currentOutput
    : JSON.stringify(currentOutput, null, 2);

  // Build comparison prompt
  let prompt = `You are a quality control system that detects drift in LLM outputs.

BASELINE (approved output):
\`\`\`
${baselineStr}
\`\`\`

CURRENT OUTPUT (to check):
\`\`\`
${currentStr}
\`\`\`
`;

  if (requirements) {
    prompt += `\n\nREQUIREMENTS/CONDITIONS:
${requirements}
`;
  }

  prompt += `
Analyze the current output compared to the baseline and determine:
1. Semantic similarity (0.0-1.0): How similar is the meaning/content?
2. Structural consistency (0.0-1.0): How similar is the structure/format?
3. Drift severity: Are there significant deviations from the baseline?

Respond ONLY with a valid JSON object in this exact format:
{
  "semantic": 0.95,
  "structural": 0.90,
  "driftSeverity": "low|medium|high",
  "driftPoints": ["specific issue 1", "specific issue 2"],
  "shouldBlock": false,
  "shouldWarn": false
}`;

  try {
    const llmResponse = await llm.generate({
      prompt: prompt,
      json: {
        semantic: 0.0,
        structural: 0.0,
        driftSeverity: "low",
        driftPoints: [],
        shouldBlock: false,
        shouldWarn: false
      }
    });

    // Parse LLM response
    let analysis: any;
    if (typeof llmResponse === "string") {
      // Extract JSON from response if it's wrapped in text
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not parse LLM response as JSON");
      }
    } else {
      analysis = llmResponse;
    }

    const semantic = Math.max(0, Math.min(1, analysis.semantic || 0.5));
    const structural = Math.max(0, Math.min(1, analysis.structural || 0.5));
    const calibration = (semantic + structural) / 2;

    const driftSeverity = analysis.driftSeverity || "low";
    const shouldBlock = analysis.shouldBlock === true;
    const shouldWarn = analysis.shouldWarn === true || driftSeverity === "medium";

    // Determine block/warn based on scores
    const block = shouldBlock || semantic < 0.3 || calibration < 0.3;
    const warn = shouldWarn || (semantic < 0.7 && semantic >= 0.3) || (calibration < 0.7 && calibration >= 0.3);

    return {
      semantic,
      calibration,
      block,
      warn,
      details: {
        driftPoints: analysis.driftPoints || [],
        differences: analysis.differences || []
      }
    };
  } catch (error) {
    // Fallback to basic comparison on error
    console.warn("LLM content check failed, using fallback:", error);
    
    // Simple string comparison fallback
    const baselineStr = typeof baseline.normalized === "string"
      ? baseline.normalized
      : JSON.stringify(baseline.normalized);
    const currentStr = typeof currentOutput === "string"
      ? currentOutput
      : JSON.stringify(currentOutput);
    
    const semantic = baselineStr === currentStr ? 1.0 : 0.5;
    
    return {
      semantic,
      calibration: semantic,
      block: semantic < 0.3,
      warn: semantic < 0.7 && semantic >= 0.3
    };
  }
}

