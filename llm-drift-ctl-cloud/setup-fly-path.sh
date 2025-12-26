#!/bin/bash
# Fly CLI PATH setup
export FLYCTL_INSTALL="$HOME/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Şimdi fly komutlarını çalıştırabilirsiniz
echo "✅ Fly CLI PATH ayarlandı"
echo ""
echo "Komutlar:"
echo "  fly auth login"
echo "  fly launch"
echo "  fly deploy"
