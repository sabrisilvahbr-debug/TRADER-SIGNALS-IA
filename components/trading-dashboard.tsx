# TRADER SIGNALS IA

Sistema de sinais, IA e gestão de carteira para mercado financeiro com dashboard moderno, autenticação local e persistência em banco SQLite.

## Stack
- Next.js 14
- React 18
- Tailwind CSS
- SQLite
- Binance public API
- OpenAI / Groq (opcional)

## Requisitos
- Node.js 18+
- npm 9+

## Instalação

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Fluxo de uso
1. Abra `/register` para criar uma conta.
2. Faça login em `/login`.
3. Acesse `/dashboard` para ver sinais reais do mercado.
4. Salve ativos na watchlist e visualize sua carteira em `/portfolio`.

## Variáveis de ambiente

```env
OPENAI_API_KEY=
GROQ_API_KEY=
PORTFOLIO_CASH_USD=50000
BINANCE_BASE_URL=https://api.binance.com
MARKET_SYMBOLS=BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT,XRPUSDT
AUTH_SECRET=trader-signals-ia-secret-dev
DB_PATH=data/trader.db
```

## Deploy
- Vercel: use `vercel.json` e configure as variáveis do ambiente.
- Docker: use o Dockerfile incluso.

## Observações
- O sistema usa dados reais da API pública da Binance.
- A IA é integrada apenas quando a chave real está presente.
- O banco SQLite é usado para autenticação e carteira local.
