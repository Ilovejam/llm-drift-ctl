# Pricing & Plans

## 🆓 FREE Plan

**No credit card required. No API key needed.**

### What's Included

✅ **FORMAT Mode** - Fully offline, LLM-free validation
- JSON structure validation
- Type checking
- Schema validation
- Null/undefined detection
- **Works completely offline**
- **No usage limits**
- **No API key needed**

### Use Cases

Perfect for:
- JSON API response validation
- Data structure checks
- Schema enforcement
- Basic output validation
- Development & testing

### How to Use

```typescript
import { DriftGuard } from "llm-drift-ctl";

// No API key = FREE plan
const guard = new DriftGuard({
  pipelineId: "my-pipeline"
});

// Works offline, no cloud needed
const result = await guard.check({
  json: { name: "John", age: 30 },
  mode: "FORMAT"
});
```

---

## 🚀 PRO Plan

**For production-grade content validation.**

### What's Included

✅ Everything in FREE plan
✅ **CONTENT Mode** - LLM-based drift detection
✅ **CALIBRATION Mode** - Advanced scoring
✅ Semantic similarity analysis
✅ Baseline comparison with LLM
✅ Custom prompt & requirements support

### Requirements

- llm-drift-ctl PRO license key
- **Your own OpenAI API key** (you pay OpenAI directly)
- **Your own prompts and requirements** (you define the validation logic)

### Pricing

- **llm-drift-ctl license**: Contact for pricing
- **OpenAI costs**: Pay OpenAI directly (GPT-4o-mini recommended, ~$0.15 per 1M tokens)

### Use Cases

Perfect for:
- Production LLM output validation
- Content drift detection
- Quality assurance for AI systems
- Technical analysis validation
- Custom validation rules

### How to Use

```typescript
import { DriftGuard, OpenAIAdapter } from "llm-drift-ctl";

// Step 1: Your OpenAI API key
const openaiAdapter = new OpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY, // YOUR key
  model: "gpt-4o-mini"
});

// Step 2: Your llm-drift-ctl PRO license key
const guard = new DriftGuard({
  pipelineId: "my-pipeline",
  llm: openaiAdapter,
  apiKey: "your-pro-license-key", // PRO license
  cloudEndpoint: "https://llm-drift-ctl-cloud.fly.dev",
  contentRequirements: `
    Your custom validation requirements:
    - Define what makes output valid
    - Set tone, structure, content rules
    - Specify validation criteria
  `
});

// Step 3: Use CONTENT mode
await guard.acceptBaseline({ json: approvedOutput });
const result = await guard.check({
  json: newOutput,
  mode: "CONTENT"
});
```

### Important Notes

⚠️ **You provide your own OpenAI API key**
- We never store or manage your OpenAI keys
- All OpenAI costs go to your OpenAI account
- You have full control over API usage

⚠️ **You define your own prompts and requirements**
- Full customization of validation logic
- You control what gets validated
- You define the rules and criteria

⚠️ **License key is separate from OpenAI key**
- llm-drift-ctl license key = Access to CONTENT mode
- OpenAI API key = Your own LLM provider account

---

## Feature Comparison

| Feature | FREE | PRO |
|---------|------|-----|
| FORMAT Mode | ✅ | ✅ |
| CONTENT Mode | ❌ | ✅ |
| CALIBRATION Mode | ❌ | ✅ |
| Offline Usage | ✅ | ✅ |
| API Key Required | ❌ | ✅ (license key) |
| OpenAI Key Required | ❌ | ✅ (your own) |
| Usage Limits | ❌ | ❌ |
| Cost | Free | License + OpenAI costs |

---

## Getting Started

1. **Start FREE**: Just install and use FORMAT mode
2. **Upgrade to PRO**: Get license key and add CONTENT mode
3. **Add your OpenAI key**: For CONTENT mode functionality

No credit card needed for FREE plan. Try it now!

