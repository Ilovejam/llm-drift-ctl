# Package Test Suite

This folder contains tests to verify both Python and Node.js packages work correctly after installation.

## Setup

### Node.js Package

```bash
npm install @ilovejam/llm-drift-ctl
npm test
# or
node test-node.js
```

### Python Package

```bash
pip install llm-drift-ctl
python test-python.py
```

## Test Files

- `test-node.js` - Tests the Node.js package (`@ilovejam/llm-drift-ctl`)
- `test-python.py` - Tests the Python package (`llm-drift-ctl`)

Both tests verify:
1. FORMAT mode works (offline validation)
2. Baseline acceptance works
3. Invalid JSON detection works

## Requirements

- Node.js: Node.js 18+ with npm
- Python: Python 3.8+ with pip

