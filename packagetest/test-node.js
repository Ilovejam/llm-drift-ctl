// Test Node.js package installation: @ilovejam/llm-drift-ctl
import { DriftGuard } from "@ilovejam/llm-drift-ctl";

async function test() {
  console.log("🧪 Testing @ilovejam/llm-drift-ctl (Node.js package)\n");
  
  const guard = new DriftGuard({
    pipelineId: "packagetest-node"
  });

  console.log("1️⃣ FORMAT mode test:");
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

  console.log("🎉 All Node.js package tests passed!");
}

test().catch(console.error);

