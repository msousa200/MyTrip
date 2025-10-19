# 🚀 DEPLOY COMPLETO - MyTrip

## ✅ STATUS ATUAL

### Frontend ✅ ONLINE
- **URL**: https://mytrip-frontend-rd09gaayz-msousa200s-projects.vercel.app
- **Status**: Deployado e funcionando
- **Falta**: Conectar ao backend

### Backend ⏳ PRONTO PARA DEPLOY
- **Plataforma**: Render (100% GRÁTIS)
- **Status**: Código preparado, aguardando deploy
- **Ficheiros prontos**: ✅

---

## 📝 O QUE PRECISAS FAZER (15 minutos)

### 1️⃣ Deploy do Backend no Render (10 min)

**Acede**: https://render.com

1. **Sign up with GitHub**
2. **New +** → **Web Service**
3. **Connect repository** → Seleciona **MyTrip**
4. Configurar:
   ```
   Name: mytrip-backend
   Root Directory: mytrip-backend ⚠️ IMPORTANTE
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   Instance Type: Free 🆓
   ```
5. **Environment Variables** (antes de criar):
   ```
   Key: GROQ_API_KEY
   Value: [Tua chave da Groq - console.groq.com]
   ```
6. **Create Web Service**
7. Aguarda 3-5 min ⏳
8. **Copia a URL** quando estiver "Live" (ex: `https://mytrip-backend.onrender.com`)

---

### 2️⃣ Conectar Frontend ao Backend (2 min)

Quando tiveres a URL do Render, corre no terminal:

```bash
cd /home/msousa/Projetos/Gerador_Roteiros/mytrip-frontend

npx vercel env add NEXT_PUBLIC_API_URL production
# Cole a URL: https://mytrip-backend.onrender.com

npx vercel --prod
```

**OU** via Dashboard Vercel:
- Settings → Environment Variables
- Adiciona/Edita: `NEXT_PUBLIC_API_URL` = `https://mytrip-backend.onrender.com`
- Deployments → Redeploy

---

### 3️⃣ Testar! 🎉 (3 min)

1. Abre: https://mytrip-frontend-rd09gaayz-msousa200s-projects.vercel.app
2. **Criar Roteiro**
3. Preenche o formulário
4. **Gerar Roteiro**
5. ⏳ Aguarda 10-30s (primeira vez pode demorar porque servidor acorda)
6. ✅ **FUNCIONA!**

---

## 📚 Documentação

- **Deploy Render**: `DEPLOY_RENDER.md` (guia completo passo a passo)
- **Deploy Vercel**: `DEPLOY_VERCEL.md` (já feito ✅)
- **Deploy Railway**: `DEPLOY_RAILWAY.md` (alternativa)

---

## 🆘 Ajuda Rápida

### Se o backend não funcionar:
1. Verifica `GROQ_API_KEY` está configurada
2. Verifica logs no Render
3. Testa: `https://mytrip-backend.onrender.com/docs`

### Se o frontend não conectar:
1. Verifica `NEXT_PUBLIC_API_URL` na Vercel
2. Verifica se re-deployaste o frontend
3. Abre consola do browser (F12) → vê erros

---

## 🎯 URLs Importantes

### Plataformas
- Render: https://render.com
- Vercel: https://vercel.com
- Groq Console: https://console.groq.com

### Teu Projeto
- GitHub: https://github.com/msousa200/MyTrip
- Frontend (Vercel): https://mytrip-frontend-rd09gaayz-msousa200s-projects.vercel.app
- Backend (Render): [Vais obter após deploy]

---

## ✅ Checklist Final

Antes de considerar COMPLETO:

- [ ] Backend deployado no Render (status: Live)
- [ ] `GROQ_API_KEY` configurada no Render
- [ ] URL do backend copiada
- [ ] `NEXT_PUBLIC_API_URL` configurada na Vercel
- [ ] Frontend re-deployado
- [ ] Testei `/docs` no backend (funciona)
- [ ] Testei criar roteiro no frontend (funciona)
- [ ] 🎉 **PROJETO ONLINE E FUNCIONANDO!**

---

## 💡 Próximos Passos (Opcional)

1. **Domínio Personalizado**: Configurar domínio próprio
2. **Analytics**: Adicionar Google Analytics
3. **SEO**: Melhorar meta tags
4. **PWA**: Transformar em Progressive Web App
5. **Partilhar**: Mostrar aos amigos! 🚀

---

**Boa sorte! Se precisares de ajuda, consulta os guias detalhados!** 📖
