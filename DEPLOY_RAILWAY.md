# 🚂 Guia de Deploy Backend no Railway

## 📋 Pré-requisitos
- Conta no [Railway](https://railway.app) (grátis - 500h/mês)
- Código no GitHub (✅ já tens)
- GROQ_API_KEY (da Groq Cloud)

## 🎯 Passo 1: Criar Conta Railway

1. Vai a [railway.app](https://railway.app)
2. Click **Login** → **Login with GitHub**
3. Autoriza o Railway a aceder ao GitHub

## 📦 Passo 2: Criar Novo Projeto

1. No dashboard, click **New Project**
2. Seleciona **Deploy from GitHub repo**
3. Escolhe o repositório **MyTrip**
4. Railway vai detetar o projeto automaticamente

## ⚙️ Passo 3: Configurar Backend

### 3.1 Configurações do Serviço

O Railway vai detetar automaticamente:
- **Root Directory**: `mytrip-backend` ✅
- **Build Command**: Automático (Nixpacks)
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 3.2 Adicionar Variáveis de Ambiente

⚠️ **CRÍTICO** - Sem isto o backend não funciona!

No painel do Railway, vai a **Variables** e adiciona:

```
GROQ_API_KEY=gsk_...sua_chave_aqui...
```

**Como obter a GROQ_API_KEY:**
1. Vai a [console.groq.com](https://console.groq.com)
2. Cria uma conta (grátis)
3. Vai a **API Keys**
4. Cria uma nova chave
5. Copia e cola no Railway

## 🚀 Passo 4: Deploy!

1. Click **Deploy**
2. Aguarda 2-3 minutos
3. Railway vai:
   - Instalar dependências Python
   - Configurar ambiente
   - Iniciar servidor FastAPI

## ✅ Passo 5: Obter URL do Backend

1. Quando o deploy terminar, vais ver o status **Active**
2. Click em **Settings** → **Networking**
3. Click em **Generate Domain**
4. Copia a URL (algo como: `https://mytrip-backend.up.railway.app`)

## 🔗 Passo 6: Conectar Frontend ao Backend

Agora que tens a URL do backend, precisa atualizar o frontend:

### Via Terminal (mais rápido):

```bash
cd mytrip-frontend
npx vercel env add NEXT_PUBLIC_API_URL production
# Cole a URL do Railway: https://mytrip-backend.up.railway.app
npx vercel --prod
```

### Via Dashboard Vercel:

1. Vai a [vercel.com](https://vercel.com)
2. Seleciona o projeto **mytrip-frontend**
3. **Settings** → **Environment Variables**
4. Edita `NEXT_PUBLIC_API_URL`
5. Muda para: `https://mytrip-backend.up.railway.app`
6. **Save**
7. **Deployments** → **Redeploy**

## 🧪 Passo 7: Testar!

1. Acede ao teu site: `https://mytrip-frontend-xxx.vercel.app`
2. Click em **Criar Roteiro**
3. Preenche o formulário
4. Click **Gerar Roteiro**
5. ✅ Deve funcionar!

## 🌐 URLs Finais

- **Frontend**: https://mytrip-frontend-rd09gaayz-msousa200s-projects.vercel.app
- **Backend**: https://mytrip-backend.up.railway.app
- **API Docs**: https://mytrip-backend.up.railway.app/docs

## 🐛 Troubleshooting

### Erro: "Application failed to respond"
- Verifica se a `GROQ_API_KEY` está configurada
- Verifica os logs no Railway

### Erro: "CORS error"
- O CORS já está configurado para `*.vercel.app`
- Se mudaste o domínio, atualiza no `app/main.py`

### Erro: "Failed to fetch"
- Verifica se a URL do backend está correta no frontend
- Verifica se o backend está online (vê os logs)

## 💰 Limites Grátis Railway

- **500h/mês** (~20 dias)
- **512MB RAM**
- **1GB disco**
- **100GB tráfego/mês**

Suficiente para testes e projetos pessoais! 🎉

## 📚 Recursos

- [Documentação Railway](https://docs.railway.app)
- [Railway Templates](https://railway.app/templates)
