// Test CONTENT mode with OpenAI
import { DriftGuard, OpenAIAdapter } from "llm-drift-ctl";

async function test() {
  console.log("🧪 Testing CONTENT mode with OpenAI\n");
  
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY environment variable is required");
    console.log("   Set it with: export OPENAI_API_KEY=your-key");
    process.exit(1);
  }

  // Create OpenAI adapter (GPT-4o-mini default)
  const openaiAdapter = new OpenAIAdapter({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o-mini" // Default model
  });

  // Create guard with OpenAI and cloud endpoint
  const guard = new DriftGuard({
    pipelineId: "test-content-pipeline",
    llm: openaiAdapter,
    apiKey: "+905377870715",
    cloudEndpoint: "https://llm-drift-ctl-cloud.fly.dev",
    contentRequirements: `This is a technical analysis output. 
The output should contain:
- Clear technical indicators
- Structured analysis
- Actionable insights
- Professional tone`
  });

  console.log("1️⃣ Accept baseline (approved output):");
  const baseline = {
    analysis: {
      indicator: "RSI",
      value: 65,
      signal: "neutral",
      recommendation: "hold"
    },
    summary: "Market shows neutral signals, recommend holding position."
  };
  
  await guard.acceptBaseline({ json: baseline });
  console.log("   ✅ Baseline accepted!\n");

  console.log("2️⃣ Check similar output (should pass):");
  const similarOutput = {
    analysis: {
      indicator: "RSI",
      value: 67,
      signal: "neutral",
      recommendation: "hold"
    },
    summary: "Market indicators suggest neutral position, maintain current holdings."
  };
  
  const result1 = await guard.check({
    json: similarOutput,
    mode: "CONTENT"
  });
  
  console.log("   Result:", JSON.stringify(result1, null, 2));
  console.log(`   Decision: ${result1.decision}`);
  console.log(`   Semantic Score: ${result1.scores.semantic}`);
  console.log(`   Calibration Score: ${result1.scores.calibration}\n`);

  console.log("3️⃣ Check very different output (should warn/block):");
  const differentOutput = {
    analysis: {
      indicator: "MACD",
      value: 85,
      signal: "strong buy",
      recommendation: "buy aggressively"
    },
    summary: "STRONG BUY SIGNAL! Invest everything now!"
  };
  
  const result2 = await guard.check({
    json: differentOutput,
    mode: "CONTENT"
  });
  
  console.log("   Result:", JSON.stringify(result2, null, 2));
  console.log(`   Decision: ${result2.decision}`);
  console.log(`   Semantic Score: ${result2.scores.semantic}`);
  console.log(`   Calibration Score: ${result2.scores.calibration}\n`);

  console.log("🎉 CONTENT mode test completed!");
}

test().catch(console.error);

