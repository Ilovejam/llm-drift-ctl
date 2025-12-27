# Test CONTENT mode with OpenAI - Python
import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../python'))

from llm_drift_ctl import DriftGuard, DriftGuardConfig, OpenAIAdapter


async def test():
    print("🧪 Testing CONTENT mode with OpenAI (Python)\n")
    
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ OPENAI_API_KEY environment variable is required")
        print("   Set it with: export OPENAI_API_KEY=your-key")
        return
    
    # Create OpenAI adapter (GPT-4o-mini default)
    openai_adapter = OpenAIAdapter(
        api_key=os.getenv("OPENAI_API_KEY"),
        model="gpt-4o-mini"
    )
    
    # Create guard with OpenAI (no license key needed - user provides their own LLM)
    guard = DriftGuard(DriftGuardConfig(
        pipeline_id="test-content-pipeline-python",
        llm=openai_adapter,
        content_requirements="""This is a technical analysis output.
The output should contain:
- Clear technical indicators
- Structured analysis
- Actionable insights
- Professional tone"""
    ))
    
    print("1️⃣ Accept baseline (approved output):")
    baseline = {
        "analysis": {
            "indicator": "RSI",
            "value": 65,
            "signal": "neutral",
            "recommendation": "hold"
        },
        "summary": "Market shows neutral signals, recommend holding position."
    }
    
    await guard.accept_baseline(json=baseline)
    print("   ✅ Baseline accepted!\n")
    
    print("2️⃣ Check similar output (should pass):")
    similar_output = {
        "analysis": {
            "indicator": "RSI",
            "value": 67,
            "signal": "neutral",
            "recommendation": "hold"
        },
        "summary": "Market indicators suggest neutral position, maintain current holdings."
    }
    
    result1 = await guard.check(
        json=similar_output,
        mode="CONTENT"
    )
    
    print(f"   Result: {result1}")
    print(f"   Decision: {result1.decision}")
    print(f"   Semantic Score: {result1.scores.get('semantic')}")
    print(f"   Calibration Score: {result1.scores.get('calibration')}\n")
    
    print("3️⃣ Check very different output (should warn/block):")
    different_output = {
        "analysis": {
            "indicator": "MACD",
            "value": 85,
            "signal": "strong buy",
            "recommendation": "buy aggressively"
        },
        "summary": "STRONG BUY SIGNAL! Invest everything now!"
    }
    
    result2 = await guard.check(
        json=different_output,
        mode="CONTENT"
    )
    
    print(f"   Result: {result2}")
    print(f"   Decision: {result2.decision}")
    print(f"   Semantic Score: {result2.scores.get('semantic')}")
    print(f"   Calibration Score: {result2.scores.get('calibration')}\n")
    
    print("🎉 CONTENT mode test completed (Python)!")


if __name__ == "__main__":
    asyncio.run(test())

