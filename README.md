# llm-drift-ctl

> **llm-drift-ctl is a drop-in guard that validates LLM outputs using your own LLM when needed — and no LLM when not.**

Production-grade LLM output validation package. This package **does NOT generate content**. It **validates LLM outputs** after they are produced.

Available in **two languages**:
- **Node.js** (TypeScript)
- **Python**

## Core Principle

`llm-drift-ctl` sits **after** any LLM:

```
User LLM → Output → llm-drift-ctl → Decision
```

We never:
- modify prompts
- generate text
- fix outputs

We only return:
- **ALLOW**
- **WARN**
- **BLOCK**

## Installation

### Node.js

```bash
npm install llm-drift-ctl
```

### Python

```bash
pip install llm-drift-ctl
```

## Quick Start

### Node.js / TypeScript

#### FORMAT Mode (LLM-free, fully offline)

```typescript
import { DriftGuard } from "llm-drift-ctl";

const guard = new DriftGuard({
  pipelineId: "my-pipeline"
});

// Check JSON format
const result = await guard.check({
  json: { name: "John", age: 30 },
  mode: "FORMAT"
});

console.log(result);
// {
//   block: false,
//   decision: "ALLOW",
//   severity: "LOW",
//   scores: { format: 1.0 },
//   where: []
// }
```

#### CONTENT Mode (requires your LLM)

```typescript
import { DriftGuard, UserLLM } from "llm-drift-ctl";

// Implement your LLM adapter
class MyLLM implements UserLLM {
  async generate(input: { prompt: string; text?: string; json?: object }) {
    // Call OpenAI, Gemini, Claude, or your custom LLM
    // You provide your own API key
    return "response from your LLM";
  }
}

const guard = new DriftGuard({
  pipelineId: "my-pipeline",
  llm: new MyLLM(),
  apiKey: "your-license-key" // for cloud license verification
});

// Accept a baseline (approved output)
await guard.acceptBaseline({
  json: { name: "John", age: 30 }
});

// Check against baseline
const result = await guard.check({
  json: { name: "Jane", age: 25 },
  mode: "CONTENT"
});
```

### Python

#### FORMAT Mode (LLM-free, fully offline)

```python
from llm_drift_ctl import DriftGuard, DriftGuardConfig

guard = DriftGuard(DriftGuardConfig(pipeline_id="my-pipeline"))

# Check JSON format (using keyword arguments)
result = await guard.check(
    json={"name": "John", "age": 30},
    mode="FORMAT"
)

# Or using CheckInput object
from llm_drift_ctl import CheckInput
result = await guard.check(
    CheckInput(json={"name": "John", "age": 30}, mode="FORMAT")
)

print(result)
# CheckResult(
#     block=False,
#     decision='ALLOW',
#     severity='LOW',
#     scores={'format': 1.0},
#     where=[]
# )
```

#### CONTENT Mode (requires your LLM)

```python
from llm_drift_ctl import DriftGuard, DriftGuardConfig, UserLLM

# Implement your LLM adapter
class MyLLM(UserLLM):
    async def generate(self, prompt, text=None, json=None):
        # Call OpenAI, Gemini, Claude, or your custom LLM
        # You provide your own API key
        return "response from your LLM"

guard = DriftGuard(DriftGuardConfig(
    pipeline_id="my-pipeline",
    llm=MyLLM(),
    api_key="your-license-key"  # for cloud license verification
))

# Accept a baseline (approved output)
await guard.accept_baseline(json={"name": "John", "age": 30})

# Check against baseline
result = await guard.check(
    json={"name": "Jane", "age": 25},
    mode="CONTENT"
)
```

## Modes of Operation

### MODE 1 — FORMAT (LLM-free)

No LLM needed. Checks:
- JSON parse validity
- Schema validation
- Required keys
- Type mismatches
- Structural consistency

This mode works **fully offline**.

### MODE 2 — CONTENT / CALIBRATION (User LLM required)

For content validation:
- You supply your own LLM (OpenAI, Gemini, Claude, or custom)
- You provide your own API key
- `llm-drift-ctl` compares outputs against approved baselines
- Detects drift from baseline behavior

## API Reference

### `DriftGuard`

Main class for LLM output validation.

#### Constructor

```typescript
new DriftGuard(config: DriftGuardConfig)
```

**Config:**
- `pipelineId` (required): Unique identifier for your pipeline
- `llm?`: User-provided LLM implementation (required for CONTENT/CALIBRATION mode)
- `cloudEndpoint?`: Cloud API endpoint (defaults to production)
- `apiKey?`: License API key (optional for FORMAT mode)

#### Methods

##### `check(input: CheckInput): Promise<CheckResult>`

Run validation check on output.

**Input:**
- `json?`: JSON object to validate
- `text?`: Text string to validate
- `mode?`: `"FORMAT" | "CONTENT" | "CALIBRATION" | "ALL"` (default: `"FORMAT"`)

**Returns:**
```typescript
{
  block: boolean;
  decision: "ALLOW" | "WARN" | "BLOCK";
  severity: "LOW" | "MEDIUM" | "HIGH";
  scores: {
    format?: number;
    semantic?: number;
    calibration?: number;
  };
  where: Array<{ path: string; type: string }>;
}
```

##### `acceptBaseline(input: { json?: object; text?: string }): Promise<void>`

Accept output as baseline (approved behavior).

### `UserLLM` Interface

Implement this interface to provide your own LLM.

**Node.js / TypeScript:**
```typescript
interface UserLLM {
  generate(input: {
    prompt: string;
    text?: string;
    json?: object;
  }): Promise<string | object>;
}
```

**Python:**
```python
from llm_drift_ctl import UserLLM

class MyLLM(UserLLM):
    async def generate(self, prompt: str, text: Optional[str] = None, json: Optional[Dict[str, Any]] = None):
        # Your LLM implementation
        return "response"
```

## How It Works

1. **Baselines** represent approved behavior (created via `acceptBaseline`)
2. **Drift** is detected by comparing new outputs to these baselines
3. **No rule-based scoring** - drift detection uses semantic comparison
4. **No hardcoded thresholds** - decisions based on baseline comparison

## Cloud Control Plane

There is a separate cloud service for:
- License verification
- Feature flags (FORMAT vs CONTENT)
- Usage tracking

The SDK:
- Calls cloud only for license checks
- Performs all drift logic locally

## Non-Goals

We explicitly do NOT:
- generate content
- correct outputs
- rewrite prompts
- auto-heal drift
- build dashboards

This is a **control system**, not an AI system.

## License

MIT

