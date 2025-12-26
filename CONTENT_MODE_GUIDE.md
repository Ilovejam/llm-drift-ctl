# CONTENT Mode Kullanım Kılavuzu

CONTENT mode, LLM çıktılarının içeriğini kontrol eder ve baseline'a göre drift tespit eder.

## ⚠️ Önemli Not

**Sen kendi OpenAI API key'ini kullanmalısın!** 
- llm-drift-ctl hiçbir API key'i saklamaz veya yönetmez
- Her kullanıcı kendi OpenAI hesabını kullanır
- API key maliyetleri senin hesabına yansır

## Kurulum

```bash
npm install llm-drift-ctl
```

## Temel Kullanım

### 1. OpenAI Adapter ile Başlatma

**⚠️ Kendi OpenAI API key'ini kullan!**

```typescript
import { DriftGuard, OpenAIAdapter } from "llm-drift-ctl";

// OpenAI adapter oluştur - KENDİ API KEY'İNİ KULLAN
const openaiAdapter = new OpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY, // ⚠️ SENİN OpenAI API key'in (ZORUNLU)
  model: "gpt-4o-mini" // Varsayılan, değiştirilebilir
});

// Guard oluştur
const guard = new DriftGuard({
  pipelineId: "my-pipeline",
  llm: openaiAdapter,
  apiKey: "+905377870715", // Cloud license key
  cloudEndpoint: "https://llm-drift-ctl-cloud.fly.dev",
  contentRequirements: `
    Bu bir teknik analiz çıktısıdır.
    Çıktı şunları içermelidir:
    - Açık teknik göstergeler
    - Yapılandırılmış analiz
    - Uygulanabilir öngörüler
    - Profesyonel ton
  `
});
```

### 2. Baseline Belirleme

```typescript
// Onaylanmış çıktıyı baseline olarak kaydet
const approvedOutput = {
  analysis: {
    indicator: "RSI",
    value: 65,
    signal: "neutral",
    recommendation: "hold"
  },
  summary: "Piyasa nötr sinyaller gösteriyor, pozisyonu tutmak önerilir."
};

await guard.acceptBaseline({ json: approvedOutput });
```

### 3. Yeni Çıktıyı Kontrol Etme

```typescript
// Yeni çıktıyı kontrol et
const newOutput = {
  analysis: {
    indicator: "RSI",
    value: 67,
    signal: "neutral",
    recommendation: "hold"
  },
  summary: "Piyasa göstergeleri nötr pozisyon öneriyor."
};

const result = await guard.check({
  json: newOutput,
  mode: "CONTENT"
});

console.log(result);
// {
//   block: false,
//   decision: "ALLOW",
//   severity: "LOW",
//   scores: {
//     semantic: 0.95,
//     calibration: 0.92
//   },
//   where: []
// }
```

## Drift Tespiti

CONTENT mode şunları kontrol eder:

1. **Semantic Similarity (0.0-1.0)**: İçerik anlam benzerliği
2. **Calibration (0.0-1.0)**: Yapısal tutarlılık
3. **Drift Points**: Spesifik sapma noktaları

### Decision Mantığı

- **ALLOW**: `semantic >= 0.7` ve `calibration >= 0.7`
- **WARN**: `semantic >= 0.3 && semantic < 0.7` veya drift noktaları var
- **BLOCK**: `semantic < 0.3` veya kritik sapma tespit edildi

## İleri Seviye

### Custom Requirements

```typescript
const guard = new DriftGuard({
  pipelineId: "technical-analysis",
  llm: openaiAdapter,
  contentRequirements: `
    Bu teknik analiz çıktısı şu özelliklere sahip olmalıdır:
    
    1. Yapı:
       - analysis: teknik göstergeler
       - summary: özet yorum
       - recommendation: aksiyon önerisi
    
    2. Ton:
       - Profesyonel ve tarafsız
       - Aşırı yükseltici olmamalı
       - Veri destekli olmalı
    
    3. İçerik:
       - Net sinyaller
       - Risk yönetimi notları
       - Zamansal bağlam
  `
});
```

### Farklı Modeller

```typescript
// GPT-4 kullanmak için
const openaiAdapter = new OpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  model: "gpt-4"
});

// Custom endpoint (ör. Azure OpenAI)
const openaiAdapter = new OpenAIAdapter({
  apiKey: process.env.AZURE_OPENAI_KEY,
  model: "gpt-4o-mini",
  baseURL: "https://your-resource.openai.azure.com/openai/deployments/gpt-4o-mini"
});
```

## Örnek: Teknik Analiz Drift Guard

```typescript
import { DriftGuard, OpenAIAdapter } from "llm-drift-ctl";

const guard = new DriftGuard({
  pipelineId: "trading-analysis",
  llm: new OpenAIAdapter({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4o-mini"
  }),
  apiKey: "+905377870715",
  cloudEndpoint: "https://llm-drift-ctl-cloud.fly.dev",
  contentRequirements: `
    Teknik analiz çıktısı kontrolü:
    - RSI, MACD gibi göstergeler tutarlı olmalı
    - Öneriler aşırı agresif olmamalı
    - Risk yönetimi notları eksik olmamalı
  `
});

// Baseline
await guard.acceptBaseline({
  json: {
    rsi: 65,
    macd: "neutral",
    recommendation: "hold",
    risk: "medium"
  }
});

// Kontrol
const result = await guard.check({
  json: newLLMOutput,
  mode: "CONTENT"
});

if (result.block) {
  console.log("⚠️ Çıktı bloke edildi:", result.where);
} else if (result.decision === "WARN") {
  console.log("⚠️ Uyarı:", result.scores);
} else {
  console.log("✅ Çıktı onaylandı");
}
```

## Önemli Notlar

1. **⚠️ API Key**: **SEN kendi OpenAI API key'ini kullanmalısın** - llm-drift-ctl hiçbir API key'i saklamaz, yönetmez veya görmez
2. **Maliyet**: Her kontrol OpenAI API çağrısı yapar - maliyetler SENİN OpenAI hesabına yansır
3. **Baseline**: İlk baseline belirlenene kadar WARN döner
4. **License**: CONTENT mode için llm-drift-ctl cloud license gerekli (OpenAI key'inden FARKLI)
5. **Güvenlik**: API key'lerini environment variable olarak sakla, kod içine yazma

