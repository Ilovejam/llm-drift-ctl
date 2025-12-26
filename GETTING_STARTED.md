# Getting Started

## Quick Start (5 minutes)

### 1. Install

**Node.js:**
```bash
npm install llm-drift-ctl
```

**Python:**
```bash
pip install llm-drift-ctl
```

### 2. Try FREE Plan (No API key needed)

**Node.js:**
```typescript
import { DriftGuard } from "llm-drift-ctl";

const guard = new DriftGuard({
  pipelineId: "my-pipeline"
});

const result = await guard.check({
  json: { name: "John", age: 30 },
  mode: "FORMAT"
});

console.log(result); // { block: false, decision: "ALLOW", ... }
```

**Python:**
```python
from llm_drift_ctl import DriftGuard, DriftGuardConfig

guard = DriftGuard(DriftGuardConfig(pipeline_id="my-pipeline"))

result = await guard.check(
    json={"name": "John", "age": 30},
    mode="FORMAT"
)

print(result)  # CheckResult(block=False, decision='ALLOW', ...)
```

### 3. Upgrade to PRO (Optional)

For CONTENT mode with LLM-based drift detection:

1. Get your OpenAI API key: https://platform.openai.com/api-keys
2. Get llm-drift-ctl PRO license (contact for details)
3. Use CONTENT mode (see [CONTENT_MODE_GUIDE.md](CONTENT_MODE_GUIDE.md))

## Next Steps

- 📖 Read [README.md](README.md) for full documentation
- 💰 Check [PRICING.md](PRICING.md) for plan details
- 🔒 Review [SECURITY.md](SECURITY.md) for security best practices
- 🤝 See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Need Help?

- Check documentation files
- Review examples in `testapps/`
- Contact support for PRO plan

