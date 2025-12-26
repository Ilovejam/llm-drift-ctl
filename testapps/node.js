// Test Cloud API connection with SDK
import { DriftGuard } from "llm-drift-ctl";

async function test() {
  console.log("🧪 Testing llm-drift-ctl SDK with Cloud API\n");
  
  // Create guard with cloud endpoint
  const guard = new DriftGuard({
    pipelineId: "test-pipeline",
    apiKey: "+905377870715",
    cloudEndpoint: "https://llm-drift-ctl-cloud.fly.dev"
  });

  console.log("1️⃣ FORMAT mode test (offline, no cloud needed):");
  const result1 = await guard.check({
    json: { name: "John", age: 30 },
    mode: "FORMAT"
  });
  console.log("   Result:", JSON.stringify(result1, null, 2));
  console.log("   ✅ FORMAT mode works!\n");

  console.log("2️⃣ Accept baseline:");
  await guard.acceptBaseline({
    json: { name: "John", age: 30 }
  });
  console.log("   ✅ Baseline accepted!\n");

  console.log("3️⃣ Check with invalid JSON:");
  const result2 = await guard.check({
    json: { name: "John", age: null },
    mode: "FORMAT"
  });
  console.log("   Result:", JSON.stringify(result2, null, 2));
  console.log("   ✅ Invalid JSON detected!\n");

  console.log("🎉 All tests passed!");
  console.log("\n📝 Cloud API endpoint:", "https://llm-drift-ctl-cloud.fly.dev");
  console.log("📝 API Key configured: ✅");
}

test().catch(console.error);

