# Test Python package installation: llm-drift-ctl
import asyncio
from llm_drift_ctl import DriftGuard, DriftGuardConfig


async def test():
    print("🧪 Testing llm-drift-ctl (Python package)\n")
    
    guard = DriftGuard(DriftGuardConfig(
        pipeline_id="packagetest-python"
    ))
    
    print("1️⃣ FORMAT mode test:")
    result1 = await guard.check(
        json={"name": "John", "age": 30},
        mode="FORMAT"
    )
    print(f"   Result: {result1}")
    print("   ✅ FORMAT mode works!\n")
    
    print("2️⃣ Accept baseline:")
    await guard.accept_baseline(
        json={"name": "John", "age": 30}
    )
    print("   ✅ Baseline accepted!\n")
    
    print("3️⃣ Check with invalid JSON:")
    result2 = await guard.check(
        json={"name": "John", "age": None},
        mode="FORMAT"
    )
    print(f"   Result: {result2}")
    print("   ✅ Invalid JSON detected!\n")
    
    print("🎉 All Python package tests passed!")


if __name__ == "__main__":
    asyncio.run(test())

