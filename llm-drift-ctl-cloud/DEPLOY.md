# Fly.io Deploy Adımları

## 0. Login (İlk kez)

```bash
export FLYCTL_INSTALL="$HOME/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
fly auth login
```

Browser açılacak, login yap.

---

## 1. App Oluştur (İlk kez)

```bash
cd llm-drift-ctl-cloud
fly launch
```

Sorular:
- App name: `llm-drift-ctl-cloud`
- Region: `ams`
- Dockerfile detected? → **Yes**
- Deploy now? → **No** (önce secret)

---

## 2. Secret Ekle

```bash
fly secrets set MASTER_KEY=prod-master-key-change-this
fly secrets list
```

---

## 3. Deploy

```bash
fly deploy
```

---

## 4. Log Kontrol

```bash
fly logs
```

---

## 5. Test

### Health
```bash
curl https://llm-drift-ctl-cloud.fly.dev/health
```

### License Verify
```bash
curl -X POST https://llm-drift-ctl-cloud.fly.dev/license/verify \
  -H "Content-Type: application/json" \
  -d '{"apiKey":"prod-master-key-change-this"}'
```

---

## Hızlı Komutlar (Login sonrası)

```bash
# PATH ayarla (her terminal açılışında)
export FLYCTL_INSTALL="$HOME/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"

# Deploy
cd llm-drift-ctl-cloud
fly deploy

# Status
fly status

# Logs
fly logs

# Secrets
fly secrets list
```

