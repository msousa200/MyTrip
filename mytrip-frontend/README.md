# MyTrip Frontend

Interface web para geração de roteiros de viagem personalizados.

## 🚀 Tecnologias

- **Next.js 15.5.6** - Framework React
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **jsPDF** - Exportação PDF

## 📦 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar servidor de desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### 3. Build para produção

```bash
npm run build
npm start
```

## 🏗️ Estrutura

```
mytrip-frontend/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Layout principal
│   ├── criar-roteiro/
│   │   └── page.tsx          # Formulário criação
│   ├── roteiro/[id]/
│   │   └── page.tsx          # Visualizar roteiro
│   └── meus-roteiros/
│       └── page.tsx          # Lista de roteiros salvos
├── lib/
│   ├── export.ts             # Funções exportação (PDF, texto)
│   └── storage.ts            # LocalStorage (salvamento)
├── public/
│   └── favicon.svg           # Ícone 🗺️
└── package.json
```

## 🎨 Funcionalidades

### Criar Roteiro
- Seleção de 23 países europeus
- 400+ destinos disponíveis
- Duração: 1-14 dias
- Orçamento personalizado (€10-500/dia)
- Interesses opcionais

### Visualizar Roteiro
- Itinerário completo com horários
- Atrações, refeições e transportes
- Preços detalhados
- Dicas personalizadas

### Exportação
- **📕 PDF**: Download formatado
- **📋 Copiar**: Texto para partilhar
- **🖨️ Imprimir**: Versão para impressão

### Armazenamento
- **LocalStorage**: Roteiros salvos no navegador
- Sem necessidade de login
- Privacidade total

## 📱 Responsividade

Design mobile-first com breakpoints TailwindCSS:
- `sm:` - ≥640px (tablets)
- `md:` - ≥768px (desktop)
- `lg:` - ≥1024px (desktop grande)

### Mobile Features
- Navegação compacta ("Criar" / "Roteiros")
- Botões com emojis apenas em telas pequenas
- Layout adaptável automaticamente

## 🔧 Configuração

### API Backend

O frontend espera que o backend esteja rodando em:
```
http://localhost:8001
```

Para mudar a URL da API, edite as chamadas em cada página (criar-roteiro/page.tsx).

## 🎯 Próximos Passos

- [ ] Deploy na Vercel
- [ ] Adicionar autenticação (opcional)
- [ ] Integração com MongoDB
- [ ] PWA (Progressive Web App)
- [ ] Modo offline

## 📚 Recursos Next.js

- [Documentação Next.js](https://nextjs.org/docs)
- [Tutorial Interativo](https://nextjs.org/learn)
- [Repositório GitHub](https://github.com/vercel/next.js)

## 🚀 Deploy

### Vercel (Recomendado)

1. Push para GitHub
2. Importar projeto na Vercel
3. Configurar variável de ambiente:
   - `NEXT_PUBLIC_API_URL=https://seu-backend.com`
4. Deploy automático!

---

Para mais informações, consulte o [README principal](../README.md) do projeto.
