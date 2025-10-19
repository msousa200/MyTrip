# 🚀 Guia de Deploy na Vercel - MyTrip

Este guia explica como fazer deploy do MyTrip (frontend) na Vercel passo a passo.

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com) (grátis)
- Repositório GitHub com o código (✅ já tens: https://github.com/msousa200/MyTrip)
- Backend deployado (vamos fazer isso depois no Railway ou Render)

## 🎯 Passo 1: Aceder à Vercel

1. Vai a [vercel.com](https://vercel.com)
2. Clica em **Sign Up** (ou **Log In** se já tens conta)
3. Escolhe **Continue with GitHub**
4. Autoriza a Vercel a aceder ao teu GitHub

## 📦 Passo 2: Importar o Projeto

1. No dashboard da Vercel, clica em **Add New** → **Project**
2. Procura o repositório **MyTrip**
3. Clica em **Import** ao lado do repositório

## ⚙️ Passo 3: Configurar o Projeto

### 3.1 Configurações Básicas

- **Project Name**: `mytrip` (ou o que quiseres)
- **Framework Preset**: Next.js (deve detetar automaticamente)
- **Root Directory**: `mytrip-frontend` ⚠️ **IMPORTANTE!**
- **Build Command**: `npm run build` (já está correto)
- **Output Directory**: `.next` (já está correto)
- **Install Command**: `npm install` (já está correto)

### 3.2 Configurar Variáveis de Ambiente

**⚠️ CRÍTICO**: Sem isto o site não vai funcionar!

Na secção **Environment Variables**, adiciona:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8001` | Development, Preview |

**Nota**: Por agora usa `http://localhost:8001`. Depois de fazer deploy do backend, vais voltar aqui e alterar para a URL do backend em produção (ex: `https://mytrip-backend.railway.app`).

## 🚀 Passo 4: Deploy!

1. Clica em **Deploy**
2. Aguarda 2-3 minutos enquanto a Vercel:
   - Instala as dependências
   - Faz build do projeto Next.js
   - Faz deploy para produção

## ✅ Passo 5: Verificar Deploy

Quando terminar, vais ver:

- ✅ **Deployment Successful**
- URL do site: `https://mytrip-xxx.vercel.app`

Clica em **Visit** para ver o site ao vivo! 🎉

## ⚠️ Problema Esperado

Neste momento, o botão "Criar Roteiro" **não vai funcionar** porque:
- O frontend está a tentar conectar-se a `http://localhost:8001`
- O backend ainda não está deployado

## 🔄 Passo 6: Deploy do Backend (Próximo)

Precisas fazer deploy do backend primeiro. Opções:

### Opção A: Railway (Recomendado - Grátis)
- Suporta Python/FastAPI
- 500h grátis/mês
- Deploy fácil

### Opção B: Render (Alternativa Grátis)
- Também suporta Python
- Gratuito mas mais lento

### Opção C: Vercel Functions (Limitado)
- Suporta Python mas com limitações
- Tempo máximo de execução: 10s (pode ser curto para a IA)

## 📝 Passo 7: Atualizar Variável de Ambiente

Depois de fazer deploy do backend:

1. Vai ao Dashboard da Vercel
2. Seleciona o projeto **mytrip**
3. Vai a **Settings** → **Environment Variables**
4. Edita `NEXT_PUBLIC_API_URL`
5. Muda para a URL do backend (ex: `https://mytrip-backend.railway.app`)
6. Clica em **Save**
7. Vai a **Deployments** → **Redeploy** (para aplicar as alterações)

## 🌐 URLs Finais

Depois de tudo configurado:

- **Frontend**: `https://mytrip-xxx.vercel.app`
- **Backend**: `https://mytrip-backend.railway.app` (ou Render)

## 🔧 Configurações Avançadas (Opcional)

### Domínio Personalizado

1. **Settings** → **Domains**
2. Adiciona o teu domínio (ex: `mytrip.com`)
3. Configura DNS conforme instruções

### Variáveis de Ambiente por Branch

- **Production**: URL do backend de produção
- **Preview**: URL do backend de staging (se tiveres)
- **Development**: `http://localhost:8001`

## 🐛 Troubleshooting

### Erro: "Page Not Found"
- Verifica se o **Root Directory** está correto: `mytrip-frontend`

### Erro: "Build Failed"
- Verifica se o `package.json` está na pasta `mytrip-frontend`
- Verifica se não há erros de TypeScript

### Erro: "Failed to fetch"
- O backend não está acessível
- Verifica a variável `NEXT_PUBLIC_API_URL`

## 📚 Recursos

- [Documentação Vercel](https://vercel.com/docs)
- [Deploy Next.js na Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Variáveis de Ambiente](https://vercel.com/docs/environment-variables)

---

**Próximos Passos**: Fazer deploy do backend no Railway! 🚂
