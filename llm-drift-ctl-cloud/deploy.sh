#!/bin/bash
# Fly.io Deploy Script
# Login sonrası çalıştır

set -e

export FLYCTL_INSTALL="$HOME/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

cd "$(dirname "$0")"

echo "🚀 Fly.io Deploy başlıyor..."
echo ""

# 1. Launch (eğer app yoksa)
if ! fly apps list | grep -q "llm-drift-ctl-cloud"; then
  echo "📦 App oluşturuluyor..."
  fly launch --no-deploy --name llm-drift-ctl-cloud --region ams
else
  echo "✅ App zaten var: llm-drift-ctl-cloud"
fi

# 2. Secret kontrol
echo ""
echo "🔑 Secret kontrol ediliyor..."
if ! fly secrets list | grep -q "MASTER_KEY"; then
  echo "⚠️  MASTER_KEY secret bulunamadı. Lütfen ekleyin:"
  echo "   fly secrets set MASTER_KEY=prod-master-key-change-this"
  exit 1
fi

# 3. Deploy
echo ""
echo "🚀 Deploy başlıyor..."
fly deploy

# 4. Status
echo ""
echo "📊 Status:"
fly status

# 5. Logs (son 20 satır)
echo ""
echo "📝 Son loglar:"
fly logs --limit 20

echo ""
echo "✅ Deploy tamamlandı!"
echo ""
echo "🧪 Test:"
echo "  curl https://llm-drift-ctl-cloud.fly.dev/health"
