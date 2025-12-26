# Security Policy

## 🔒 API Keys & Secrets

**NEVER commit API keys, secrets, or credentials to the repository.**

### Protected Files

The following files are automatically ignored by `.gitignore`:

- `.env` files
- `*_key`, `*_KEY` files
- `*secret*`, `*SECRET*` files
- `*token*`, `*TOKEN*` files
- `*api*key*`, `*API*KEY*` files
- Any file containing credentials or passwords

### Environment Variables

Use `.env` files for local development:

1. Copy `.env.example` to `.env`
2. Fill in your values
3. **NEVER commit `.env` to git**

### API Keys

#### OpenAI API Key
- Required for CONTENT mode
- **You provide your own** - we never store it
- Get from: https://platform.openai.com/api-keys
- Costs go to your OpenAI account

#### llm-drift-ctl License Key
- Required for PRO plan (CONTENT mode)
- Separate from OpenAI API key
- Contact for PRO license

### Reporting Security Issues

If you discover a security vulnerability, please:
1. **DO NOT** open a public issue
2. Contact security team privately
3. Include details and steps to reproduce

## Best Practices

- ✅ Use environment variables for secrets
- ✅ Use `.env.example` as a template
- ✅ Review commits before pushing
- ❌ Never hardcode secrets in code
- ❌ Never commit `.env` files
- ❌ Never share API keys publicly

