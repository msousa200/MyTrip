# 🎨 Guia de Deploy Backend no Render (100% GRÁTIS!)

## 🆓 Por que Render?
- ✅ **Totalmente grátis** - sem limites de horas
- ✅ **SSL automático** (HTTPS)
- ✅ **Deploy automático** do GitHub
- ✅ **Sem cartão de crédito** necessário
- ⚠️ Servidor adormece após 15min sem uso (acorda em ~30s)

## 📋 Pré-requisitos
- Conta no [Render](https://render.com) (grátis)
- Código no GitHub (✅ já tens)
- GROQ_API_KEY (da Groq Cloud)

---

## 🎯 Passo 1: Criar Conta Render

1. Vai a [render.com](https://render.com)
2. Click **Get Started** ou **Sign Up**
3. Escolhe **Sign up with GitHub**
4. Autoriza o Render a aceder ao GitHub

---

## 📦 Passo 2: Criar Web Service

1. No dashboard do Render, click **New +** (canto superior direito)
2. Seleciona **Web Service**
3. Click **Connect a repository**
4. Se não vires o repositório **MyTrip**:
   - Click **Configure account**
   - Dá acesso ao repositório **MyTrip**
   - Volta atrás
5. Click **Connect** ao lado de **MyTrip**

---

## ⚙️ Passo 3: Configurar o Serviço

Preenche os campos:

### Informações Básicas
- **Name**: `mytrip-backend` (ou o que quiseres)
- **Region**: Europe (Paris) ou US East
- **Branch**: `main`
- **Root Directory**: `mytrip-backend` ⚠️ **IMPORTANTE!**

### Build & Deploy
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Instância
- **Instance Type**: `Free` ⬅️ **Seleciona GRÁTIS!**

---

## 🔐 Passo 4: Adicionar Variáveis de Ambiente

⚠️ **CRÍTICO** - Sem isto não funciona!

**Antes de clicar em "Create Web Service"**, desce até **Environment Variables**:

1. Click **Add Environment Variable**
2. **Key**: `GROQ_API_KEY`
3. **Value**: A tua chave da Groq
   - Se não tens: vai a [console.groq.com](https://console.groq.com)
   - Cria conta → API Keys → Create Key → Copia

---

## 🚀 Passo 5: Deploy!

1. Verifica tudo está correto
2. Click **Create Web Service**
3. Aguarda 3-5 minutos
4. Render vai:
   - ✅ Clonar o repositório
   - ✅ Instalar Python e dependências
   - ✅ Iniciar o servidor FastAPI
   - ✅ Gerar URL pública

---

## ✅ Passo 6: Obter URL do Backend

1. Quando o deploy terminar, vais ver **Live** (círculo verde)
2. No topo da página, copia a URL:
   - Exemplo: `https://mytrip-backend.onrender.com`
3. Testa abrindo no browser: `https://mytrip-backend.onrender.com/docs`
   - Deves ver a documentação da API (Swagger)

---

## 🔗 Passo 7: Conectar Frontend ao Backend

Agora que tens a URL do backend, atualiza o frontend:

### Opção A: Via Vercel CLI (Terminal)

```bash
cd /home/msousa/Projetos/Gerador_Roteiros/mytrip-frontend
npx vercel env add NEXT_PUBLIC_API_URL production
# Quando pedir o valor, cola: https://mytrip-backend.onrender.com
npx vercel --prod
```

### Opção B: Via Dashboard Vercel

1. Vai a [vercel.com](https://vercel.com)
2. Seleciona o projeto **mytrip-frontend**
3. **Settings** → **Environment Variables**
4. Edita ou adiciona `NEXT_PUBLIC_API_URL`:
   - **Value**: `https://mytrip-backend.onrender.com`
5. **Save**
6. Vai a **Deployments** → Click nos 3 pontos do último deploy → **Redeploy**

---

## 🧪 Passo 8: Testar o Site Completo! 🎉

1. Acede ao teu site: https://mytrip-frontend-rd09gaayz-msousa200s-projects.vercel.app
2. Click em **Criar Roteiro**
3. Preenche:
   - País: Portugal
   - Cidade: Lisboa
   - Duração: 2 dias
   - Orçamento: €50/dia
4. Click **Gerar Roteiro**
5. **Aguarda 10-30 segundos** (IA a trabalhar)
6. ✅ **FUNCIONA!** 🎊

⚠️ **Primeira vez pode demorar ~30s** porque o servidor Render "acorda"

---

## 🌐 URLs Finais

- **Frontend**: https://mytrip-frontend-rd09gaayz-msousa200s-projects.vercel.app
- **Backend**: https://mytrip-backend.onrender.com
- **API Docs**: https://mytrip-backend.onrender.com/docs
- **API Health**: https://mytrip-backend.onrender.com/health

---

## 🐛 Troubleshooting

### ❌ Build Failed
**Erro**: `Could not find requirements.txt`
- **Solução**: Verifica se **Root Directory** = `mytrip-backend`

### ❌ Application Error
**Erro**: Servidor não inicia
- **Solução**: Verifica se a `GROQ_API_KEY` está configurada
- Vai a **Environment** → Verifica a variável

### ❌ Deploy muito lento
- É normal! Render grátis é mais lento (3-5 min)
- Paciência! ☕

### ⏳ Primeira request demora muito
- **Normal!** Servidor estava a "dormir"
- Próximas requests são rápidas (2-5s)
- Se não usares por 15min, volta a adormecer

### ❌ CORS Error
- Já está configurado para `*.vercel.app`
- Se mudaste domínio, atualiza `app/main.py`

---

## 💰 Limites do Plano Grátis Render

- ✅ **Grátis para sempre**
- ✅ **750h/mês** de runtime (suficiente!)
- ✅ **512MB RAM**
- ✅ **SSL/HTTPS grátis**
- ⚠️ Servidor adormece após **15 min sem uso**
- ⚠️ Tempo de "acordar": ~30 segundos

**Dica**: Para projetos pessoais está perfeito! 🎯

---

## 🚀 Deploy Automático

**Boa notícia!** ✨

Cada vez que fizeres `git push` no GitHub, o Render faz **deploy automático**!

```bash
cd /home/msousa/Projetos/Gerador_Roteiros
# Faz alterações...
git add .
git commit -m "feat: melhorias no backend"
git push origin main
# Render deteta e faz deploy automaticamente! 🚀
```

---

## 📚 Recursos

- [Documentação Render](https://render.com/docs)
- [Deploy FastAPI no Render](https://render.com/docs/deploy-fastapi)
- [Render Free Tier](https://render.com/docs/free)

---

## ✅ Checklist Final

Antes de testar, confirma:

- [ ] Backend deployado no Render (status: Live)
- [ ] `GROQ_API_KEY` configurada
- [ ] URL do backend copiada
- [ ] Variável `NEXT_PUBLIC_API_URL` atualizada na Vercel
- [ ] Frontend re-deployado
- [ ] Testaste `/docs` no backend
- [ ] Testaste criar roteiro no frontend

**Se tudo ✅, o teu site está COMPLETO e ONLINE! 🎉**

---

**Próximo passo**: Testa e diverte-te! Se quiseres domínio personalizado, posso ajudar depois! 🌐
