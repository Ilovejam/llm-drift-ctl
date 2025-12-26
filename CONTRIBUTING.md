# Contributing to llm-drift-ctl

Thank you for your interest in contributing!

## Development Setup

### Node.js SDK

```bash
npm install
npm run build
```

### Python SDK

```bash
cd python
pip install -e ".[dev]"
```

## Code Style

- TypeScript: Use strict mode, follow existing patterns
- Python: Follow PEP 8, use type hints
- Both: Match existing code style

## Testing

### Node.js

```bash
npm test
```

### Python

```bash
cd python
pytest
```

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Security

**Never commit:**
- API keys
- Secrets
- `.env` files
- Personal credentials

See [SECURITY.md](SECURITY.md) for details.

