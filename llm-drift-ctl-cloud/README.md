# llm-drift-ctl-cloud

Control plane API for llm-drift-ctl SDK.

## Setup

### Prerequisites

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Login to Fly.io:
```bash
fly auth login
```

### Local Development

```bash
npm install
npm run dev
```

The API will be available at `http://localhost:8080`

### Docker Local Test

```bash
docker build -t llm-drift-ctl-cloud .
docker run -p 8080:8080 -e MASTER_KEY=test-key llm-drift-ctl-cloud
```

Test:
```bash
curl http://localhost:8080/health
```

### Deploy to Fly.io

1. Create the Fly app (if not already created):
```bash
fly launch
```

Answer the prompts:
- App name: `llm-drift-ctl-cloud`
- Region: `ams` (EU)
- Dockerfile: Yes
- Deploy now: No (we need to set secrets first)

2. Set the master API key secret:
```bash
fly secrets set MASTER_KEY=your-super-secret-key-here
```

3. Deploy:
```bash
fly deploy
```

4. Check status:
```bash
fly status
fly logs
```

5. Test the health endpoint:
```bash
curl https://llm-drift-ctl-cloud.fly.dev/health
```

## API Endpoints

### GET /health
Health check endpoint.

**Response:**
```json
{
  "ok": true
}
```

### POST /license/verify
Verify an API key license.

**Request:**
```json
{
  "apiKey": "your-api-key"
}
```

**Response (valid):**
```json
{
  "valid": true,
  "plan": "pro",
  "features": ["FORMAT", "CONTENT", "CALIBRATION"]
}
```

**Response (invalid):**
```json
{
  "valid": false
}
```
Status: 401

