#!/bin/bash
# Cloud API Test Script

ENDPOINT="https://llm-drift-ctl-cloud.fly.dev"
API_KEY="+905377870715"

echo "═══════════════════════════════════════════════════════"
echo "🧪 Cloud API Test"
echo "═══════════════════════════════════════════════════════"
echo ""

# 1. Health Check
echo "1️⃣  Health Check:"
echo "   curl $ENDPOINT/health"
echo ""
RESULT=$(curl -s "$ENDPOINT/health")
echo "   Result: $RESULT"
echo ""

# 2. License Verify (Valid Key)
echo "2️⃣  License Verify (Valid Key):"
echo "   curl -X POST $ENDPOINT/license/verify -H 'Content-Type: application/json' -d '{\"apiKey\":\"$API_KEY\"}'"
echo ""
RESULT=$(curl -s -X POST "$ENDPOINT/license/verify" \
  -H "Content-Type: application/json" \
  -d "{\"apiKey\":\"$API_KEY\"}")
echo "   Result: $RESULT"
echo ""

# 3. License Verify (Invalid Key)
echo "3️⃣  License Verify (Invalid Key):"
echo "   curl -X POST $ENDPOINT/license/verify -H 'Content-Type: application/json' -d '{\"apiKey\":\"wrong-key\"}'"
echo ""
HTTP_CODE=$(curl -s -w "%{http_code}" -o /tmp/response.json -X POST "$ENDPOINT/license/verify" \
  -H "Content-Type: application/json" \
  -d '{"apiKey":"wrong-key"}')
RESULT=$(cat /tmp/response.json)
echo "   Result: $RESULT"
echo "   HTTP Status: $HTTP_CODE"
echo ""

echo "═══════════════════════════════════════════════════════"
echo "✅ Test tamamlandı!"
echo "═══════════════════════════════════════════════════════"

