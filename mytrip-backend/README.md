# MyTrip Backend

API backend para geração de roteiros de viagem com IA.

## 🚀 Tecnologias

- **FastAPI** - Framework web moderno
- **Python 3.11+** - Linguagem
- **Groq AI** - LLaMA 3.3 70B Versatile
- **Pydantic** - Validação de dados

## 📦 Instalação

### 1. Criar ambiente virtual

```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente

Crie um ficheiro `.env`:

```env
GROQ_API_KEY=sua_chave_groq_aqui
```

**Obter chave gratuita**: https://console.groq.com

### 4. Executar servidor

```bash
uvicorn app.main:app --reload --port 8001
```

Servidor rodando em: http://localhost:8001

## 📋 API Endpoints

- `GET /` - Informação da API
- `GET /health` - Health check
- `POST /api/v1/trips` - Criar roteiro
- `GET /api/v1/trips` - Listar roteiros
- `GET /api/v1/trips/{id}` - Obter roteiro específico
- `DELETE /api/v1/trips/{id}` - Remover roteiro

## 📚 Documentação Interativa

- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

## 🏗️ Estrutura

```
mytrip-backend/
├── app/
│   ├── main.py              # App principal
│   ├── models/
│   │   └── trip.py          # Modelos Pydantic
│   ├── routes/
│   │   └── trips.py         # Rotas da API
│   └── services/
│       └── openai_service.py # Integração Groq AI
├── requirements.txt
└── .env
```

## 🌍 Destinos Suportados

23 países europeus, 400+ destinos incluindo Portugal, Espanha, França, Itália, Alemanha, Reino Unido, Grécia, e muito mais.

## 🤖 IA

- **Modelo**: LLaMA 3.3 70B Versatile (Groq)
- **4-6 atrações por dia** com horários
- **Validação rigorosa de orçamento** (€10-500/dia)
- **Sugestões personalizadas** de restaurantes e transportes

---

Para mais informações, consulte o [README principal](../README.md) do projeto.
