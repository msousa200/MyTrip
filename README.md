# 🗺️ MyTrip - Gerador de Roteiros de Viagem

Gerador inteligente de roteiros de viagem personalizados para toda a Europa, powered by IA.

## 🌟 Funcionalidades

- **🤖 IA Inteligente**: Roteiros gerados com Groq AI (LLaMA 3.3 70B)
- **📍 23 Países Europeus**: Mais de 400 destinos disponíveis
- **⏱️ Horários Detalhados**: Itinerários completos das 9h às 19h
- **💰 Orçamento Personalizado**: Defina seu budget diário (€10-500)
- **🍽️ Restaurantes e Atrações**: Sugestões com preços reais
- **📱 Mobile-First**: Design totalmente responsivo
- **📕 Exportação PDF**: Leve seu roteiro no telemóvel
- **📋 Copiar e Partilhar**: Compartilhe facilmente
- **🖨️ Impressão**: Formate para imprimir

## 🚀 Tecnologias

### Frontend
- **Next.js 15.5.6** (React 19)
- **TypeScript**
- **TailwindCSS**
- **jsPDF** (exportação PDF)

### Backend
- **FastAPI** (Python 3.11+)
- **Groq AI** (LLaMA 3.3 70B Versatile)
- **Pydantic** (validação)

## 📦 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/msousa200/MyTrip.git
cd MyTrip
```

### 2. Configurar Backend

```bash
cd mytrip-backend

# Criar ambiente virtual
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou no Windows: .venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variável de ambiente
# Crie um ficheiro .env com:
GROQ_API_KEY=sua_chave_groq_aqui

# Executar servidor (porta 8001)
uvicorn app.main:app --reload --port 8001
```

**Obter chave Groq gratuitamente:**
1. Acesse: https://console.groq.com
2. Crie conta grátis
3. Vá em "API Keys" e gere uma chave
4. Cole no ficheiro `.env`

### 3. Configurar Frontend

```bash
cd ../mytrip-frontend

# Instalar dependências
npm install

# Executar servidor (porta 3000)
npm run dev
```

### 4. Acessar aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **Documentação API**: http://localhost:8001/docs

## 🎯 Como Usar

1. **Escolher Destino**: Selecione um dos 23 países europeus e cidade específica
2. **Definir Duração**: De 1 a 14 dias
3. **Orçamento**: Escolha budget diário (€10-500/dia)
4. **Interesses** (opcional): Cultura, Gastronomia, Natureza, etc.
5. **Gerar Roteiro**: IA cria itinerário completo
6. **Exportar**: PDF, copiar ou imprimir

## 📍 Países Disponíveis

Portugal, Espanha, França, Itália, Alemanha, Reino Unido, Grécia, Países Baixos, Suíça, Áustria, Bélgica, Irlanda, República Checa, Polónia, Hungria, Croácia, Dinamarca, Suécia, Noruega, Finlândia, Islândia, Turquia, Malta

**400+ destinos incluindo**: Lisboa, Porto, Madrid, Barcelona, Paris, Roma, Berlim, Amsterdão, Londres, Atenas, Viena, Praga, e muito mais!

## 🏗️ Estrutura do Projeto

```
MyTrip/
├── mytrip-backend/          # API FastAPI
│   ├── app/
│   │   ├── main.py          # Aplicação principal
│   │   ├── models/          # Modelos Pydantic
│   │   ├── routes/          # Rotas da API
│   │   └── services/        # Serviços (Groq AI)
│   ├── requirements.txt
│   └── .env                 # Variáveis de ambiente
│
└── mytrip-frontend/         # App Next.js
    ├── app/
    │   ├── page.tsx         # Homepage
    │   ├── criar-roteiro/   # Formulário criação
    │   ├── roteiro/[id]/    # Visualizar roteiro
    │   └── meus-roteiros/   # Lista de roteiros
    ├── lib/
    │   ├── export.ts        # Exportação PDF
    │   └── storage.ts       # LocalStorage
    └── package.json
```

## 📋 API Endpoints

- `GET /` - Informação da API
- `GET /health` - Health check
- `POST /api/v1/trips` - Criar roteiro
- `GET /api/v1/trips` - Listar roteiros
- `GET /api/v1/trips/{id}` - Obter roteiro
- `DELETE /api/v1/trips/{id}` - Remover roteiro

## 💾 Armazenamento

- **Frontend**: LocalStorage (client-side)
- **Backend**: Em memória (sem persistência)
- **Futuro**: MongoDB opcional

## 🎨 Recursos da IA

A IA gera roteiros com:
- **4-6 atrações por dia** com horários específicos
- **3 refeições** (pequeno-almoço, almoço, jantar) com preços
- **Transportes** e custos
- **Descrições detalhadas** de cada local
- **Validação de orçamento** rigorosa
- **Dicas personalizadas** por região

### Exemplo de Budget:
- **€10-50/dia**: Atrações gratuitas, restaurantes económicos
- **€50-120/dia**: 1-2 atrações pagas, restaurantes tradicionais
- **€120+/dia**: Múltiplas atrações premium, restaurantes de qualidade

## 📱 Mobile Responsive

- Navegação compacta em mobile ("Criar" / "Roteiros")
- Botões de exportação apenas com emojis em telas pequenas
- Layout adaptável (TailwindCSS breakpoints: sm:, md:, lg:)

## 📄 Licença

© 2025 MyTrip. Todos os direitos reservados.

## 👤 Autor

**Miguel Sousa**
- LinkedIn: [miguel-sousa-264629134](https://www.linkedin.com/in/miguel-sousa-264629134/)
- Email: msousa200@gmail.com

## 🤝 Contribuir

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adicionar MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma issue no GitHub: https://github.com/msousa200/MyTrip/issues

## ⭐ Star o Projeto

Se este projeto foi útil, dê uma ⭐ no GitHub!

---


