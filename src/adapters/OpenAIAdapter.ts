import { UserLLM } from "../types.js";

/**
 * OpenAI Adapter for llm-drift-ctl
 * 
 * Uses GPT-4o-mini by default for content validation
 * 
 * ⚠️ IMPORTANT: You must provide your own OpenAI API key.
 * llm-drift-ctl never stores or manages API keys.
 */
export class OpenAIAdapter implements UserLLM {
  private apiKey: string;
  private model: string;
  private baseURL: string;

  constructor(config: {
    apiKey: string; // ⚠️ YOUR OpenAI API key (required)
    model?: string;
    baseURL?: string;
  }) {
    if (!config.apiKey) {
      throw new Error("OpenAI API key is required - you must provide your own API key");
    }
    this.apiKey = config.apiKey;
    this.model = config.model || "gpt-4o-mini";
    this.baseURL = config.baseURL || "https://api.openai.com/v1";
  }

  async generate(input: {
    prompt: string;
    text?: string;
    json?: object;
  }): Promise<string | object> {
    const messages: Array<{ role: string; content: string }> = [];
    
    // Build the prompt
    let systemPrompt = input.prompt;
    
    if (input.json) {
      systemPrompt += `\n\nExpected JSON structure:\n${JSON.stringify(input.json, null, 2)}`;
    }
    
    if (input.text) {
      messages.push({
        role: "system",
        content: systemPrompt
      });
      messages.push({
        role: "user",
        content: input.text
      });
    } else {
      messages.push({
        role: "user",
        content: systemPrompt
      });
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          temperature: 0.3, // Lower temperature for consistent validation
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
      }

      const data = await response.json() as any;
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("No content in OpenAI response");
      }

      // Try to parse as JSON if input.json was provided
      if (input.json) {
        try {
          return JSON.parse(content);
        } catch {
          // Return as string if JSON parse fails
          return content;
        }
      }

      return content;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`OpenAI API call failed: ${String(error)}`);
    }
  }
}

