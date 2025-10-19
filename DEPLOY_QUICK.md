# ⚡ Deploy Rápido - Vercel

## 1️⃣ Acede a [vercel.com](https://vercel.com)

## 2️⃣ Click "Add New" → "Project"

## 3️⃣ Importa "MyTrip" do GitHub

## 4️⃣ **IMPORTANTE - Configurações:**

```
Project Name: mytrip
Framework: Next.js
Root Directory: mytrip-frontend  ⬅️ CRÍTICO!
```

## 5️⃣ **Adiciona Variável de Ambiente:**

```
Name: NEXT_PUBLIC_API_URL
Value: http://localhost:8001
```
(Vais atualizar depois com a URL do backend)

## 6️⃣ Click "Deploy" e aguarda 2-3 minutos ⏳

## 7️⃣ ✅ Pronto! Site online em `https://mytrip-xxx.vercel.app`

---

## ⚠️ Próximo Passo Obrigatório

O frontend está online mas **não funciona ainda** porque o backend está em localhost.

**Tens de fazer deploy do backend** (Railway ou Render) e depois:

1. Vai a Vercel → Settings → Environment Variables
2. Atualiza `NEXT_PUBLIC_API_URL` para a URL do backend
3. Redeploy

---

## 🎯 Resumo Visual

```
┌─────────────────────────────────────────┐
│  1. Vercel.com → Sign Up/Login          │
│  2. Add New → Project                   │
│  3. Import "MyTrip"                     │
│  4. Root Directory: mytrip-frontend     │
│  5. Env Var: NEXT_PUBLIC_API_URL        │
│  6. Deploy                              │
│  7. ✅ Site Online!                     │
└─────────────────────────────────────────┘
```
