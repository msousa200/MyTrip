# MyTrip Frontend 🗺️

Interface web moderna para geração de roteiros de viagem personalizados por IA na Europa.

## 🚀 Tecnologias

- **Next.js 15.5.6** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização utility-first
- **jsPDF** - Exportação de PDFs

## 📦 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/msousa200/MyTrip.git
cd MyTrip/mytrip-frontend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar servidor de desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

### 4. Build para produção

```bash
npm run build
npm start
```

## 🏗️ Estrutura do Projeto

```
mytrip-frontend/
├── app/
│   ├── page.tsx                    # Homepage com hero e features
│   ├── layout.tsx                  # Layout global (dark mode)
│   ├── globals.css                 # Estilos globais + animações
│   ├── components/
│   │   └── ScrollAnimation.tsx     # Componente de scroll animations
│   ├── criar-roteiro/
│   │   └── page.tsx                # Formulário de criação de roteiro
│   ├── roteiro/[id]/
│   │   └── page.tsx                # Visualização de roteiro gerado
│   └── meus-roteiros/
│       └── page.tsx                # Lista de roteiros salvos
├── lib/
│   ├── export.ts                   # Funções de exportação (PDF, copiar)
│   └── storage.ts                  # Gestão de localStorage
└── public/
    └── favicon.svg                 # Ícone do site 🗺️
```

## ✨ Funcionalidades

### 🌍 Criar Roteiro
- **23 países europeus** disponíveis
- **400+ destinos** (Lisboa, Paris, Barcelona, Roma, etc.)
- **Duração**: 1 a 10 dias
- **Orçamento personalizado**: €0-500/dia
- **Interesses**: História, Gastronomia, Natureza, Praias, etc.

### 📋 Visualizar Roteiro
- Itinerário detalhado dia a dia
- Horários específicos (8h-19h)
- Atrações com duração de visita
- Restaurantes com sugestões de preços
- Dicas personalizadas por país
- Estimativa de custos total

### 💾 Exportação e Armazenamento
- **📕 PDF**: Download formatado sem emojis (compatibilidade total)
- **📋 Copiar**: Texto completo para partilhar
- **🖨️ Imprimir**: Versão otimizada para impressão
- **LocalStorage**: Roteiros salvos localmente (sem login necessário)

### 🎨 Design e UX
- **Dark Mode**: Suporte automático ao tema do sistema
- **Scroll Animations**: Animações suaves ao scroll (fade, up, down, left, right)
- **Responsivo**: Design mobile-first totalmente adaptável
- **Navegação intuitiva**: Dropdowns ordenados alfabeticamente

## 📱 Responsividade

Design mobile-first com breakpoints TailwindCSS:

| Breakpoint | Largura | Dispositivo |
|------------|---------|-------------|
| `sm:` | ≥640px | Tablets |
| `md:` | ≥768px | Desktop pequeno |
| `lg:` | ≥1024px | Desktop grande |

### Mobile Features
- Navegação compacta: "Criar" / "Roteiros"
- Botões com apenas emojis em telas pequenas
- Layout de cards empilhado verticalmente
- Touch-friendly com targets ≥44px

## 🎭 Scroll Animations

Componente `ScrollAnimation` com IntersectionObserver:

```tsx
<ScrollAnimation direction="up" delay={100}>
  <div>Conteúdo animado</div>
</ScrollAnimation>
```

**Direções disponíveis**: `up`, `down`, `left`, `right`, `fade`  
**Delays**: 0ms, 100ms, 200ms, 300ms (para efeito cascata)

## 🔧 Configuração

### Backend API

O frontend conecta-se ao backend em:
```
http://localhost:8001
```

Para alterar a URL da API, edite as chamadas `fetch` em:
- `app/criar-roteiro/page.tsx` (linha ~140)

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
```

## 🌍 Destinos Disponíveis

**23 países europeus** com 400+ destinos:

- 🇵🇹 **Portugal**: Lisboa, Porto, Algarve, Douro, Açores, Madeira...
- 🇪🇸 **Espanha**: Barcelona, Madrid, Sevilha, Granada, Ibiza...
- 🇫🇷 **França**: Paris, Provence, Côte d'Azur, Bordeaux, Lyon...
- 🇮🇹 **Itália**: Roma, Veneza, Florença, Milão, Nápoles, Toscana...
- 🇬🇷 **Grécia**: Atenas, Santorini, Mykonos, Creta, Rodes...
- 🇩🇪 **Alemanha**: Berlim, Munique, Hamburgo, Frankfurt...
- 🇬🇧 **Reino Unido**: Londres, Liverpool, Manchester, Cambridge...
- 🇳🇱 **Holanda**: Amsterdão, Roterdão, Haia, Utrecht...
- E mais 15 países!

## 🎯 Próximos Passos

- [ ] Deploy na Vercel
- [ ] Adicionar autenticação (opcional)
- [ ] Integração com MongoDB para sync cross-device
- [ ] PWA (Progressive Web App)
- [ ] Modo offline com Service Workers
- [ ] Sistema de favoritos por atração
- [ ] Partilha de roteiros via link

## 🚀 Deploy

### Vercel (Recomendado)

1. Push o código para GitHub
2. Importar projeto na [Vercel](https://vercel.com)
3. Configurar variáveis de ambiente:
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
   ```
4. Deploy automático! ✨

### Build Manual

```bash
npm run build
npm start
```

Ou usar Docker:

```bash
docker build -t mytrip-frontend .
docker run -p 3000:3000 mytrip-frontend
```

## 📚 Recursos

- [Documentação Next.js](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [jsPDF](https://github.com/parallax/jsPDF)
- [TypeScript](https://www.typescriptlang.org/docs)

## 📄 Licença

Este projeto é parte do **MyTrip** - Gerador de Roteiros Europeus com IA.

---

Para mais informações sobre o projeto completo, consulte o [README principal](../README.md).
