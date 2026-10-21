# TRADER SIGNALS IA

Dashboard moderno de sinais de mercado com IA, integrando dados reais da Binance e análise técnica computacional.

## Stack
- Next.js 14
- React 18
- Tailwind CSS
- Binance API (dados reais de mercado)
- Integrado com OpenAI/Groq quando as chaves estiverem configuradas

## Requisitos
- Node.js 18+
- npm 9+

## Instalação

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Arquivos de ambiente

```env
OPENAI_API_KEY=
GROQ_API_KEY=
PORTFOLIO_CASH_USD=50000
BINANCE_BASE_URL=https://api.binance.com
```

## Observações

- Sem dados simulados: os preços e indicadores são extraídos diretamente da API pública da Binance.
- A IA pode ser habilitada com chave real do OpenAI ou Groq. Se não existir, o sistema usa a análise técnica local com o mesmo conjunto de dados do mercado.
- O painel é totalmente responsivo e moderno.
