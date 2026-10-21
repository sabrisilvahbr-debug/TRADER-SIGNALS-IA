import { getMarketOverview } from "@/lib/market";

export type DashboardPayload = {
  generatedAt: string;
  marketSummary: string;
  marketOverview: Array<{
    symbol: string;
    price: number;
    changePercent: number;
    volume: number;
    high: number;
    low: number;
    signal: string;
    trend: string;
    bias: string;
    confidence: number;
    rsi: number;
    ema9: number;
    ema21: number;
  }>;
  ai: {
    provider: string;
    summary: string;
    confidence: number;
    tradePlan: string[];
  };
  portfolio: {
    totalValue: number;
    allocations: Array<{
      symbol: string;
      weight: number;
      value: number;
      color: string;
    }>;
  };
};

function buildTradePlan(marketOverview: DashboardPayload["marketOverview"]) {
  return marketOverview.map((item) => {
    if (item.signal === "COMPRA") {
      return `Priorizar entrada em ${item.symbol} com confirmação do suporte local e gestão de risco em 1,5% do portfólio.`;
    }
    if (item.signal === "VENDA") {
      return `Reduzir exposição em ${item.symbol} e manter estratégia defensiva até reverter o impulso.`;
    }
    return `Monitorar ${item.symbol} com movimento lateral e aguardar breakout para confirmar tendência.`;
  });
}

function composeLocalSummary(marketOverview: DashboardPayload["marketOverview"]) {
  const buySignals = marketOverview.filter((item) => item.signal === "COMPRA").length;
  const sellSignals = marketOverview.filter((item) => item.signal === "VENDA").length;
  const avgConfidence = marketOverview.reduce((total, item) => total + item.confidence, 0) / Math.max(marketOverview.length, 1);

  return {
    provider: "local",
    summary: `O mercado está com ${buySignals} sinais de compra e ${sellSignals} de venda. A inteligência técnica confirma que os ativos de maior liquidez continuam com força e a confiança média da estratégia está em ${avgConfidence.toFixed(0)}%.`,
    confidence: Number(avgConfidence.toFixed(0)),
  };
}

async function askAiForSummary(marketOverview: DashboardPayload["marketOverview"]) {
  const openAiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (openAiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content: "Você é um analista de mercado profissional e responde em português. Seja objetivo, técnico e acionável.",
            },
            {
              role: "user",
              content: JSON.stringify(marketOverview),
            },
          ],
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const text = result.choices?.[0]?.message?.content;
        if (text) {
          return {
            provider: "openai",
            summary: text,
            confidence: 79,
          };
        }
      }
    } catch (error) {
      console.error("OpenAI falhou:", error);
    }
  }

  if (groqKey) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content: "Você é um analista de mercado profissional. Responda em português e mencione risco, tendência, timing e alocação.",
            },
            {
              role: "user",
              content: JSON.stringify(marketOverview),
            },
          ],
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const text = result.choices?.[0]?.message?.content;
        if (text) {
          return {
            provider: "groq",
            summary: text,
            confidence: 77,
          };
        }
      }
    } catch (error) {
      console.error("Groq falhou:", error);
    }
  }

  return composeLocalSummary(marketOverview);
}

export async function buildDashboardPayload(): Promise<DashboardPayload> {
  const market = await getMarketOverview();
  const marketOverview = market.marketOverview;

  if (!marketOverview.length) {
    return {
      generatedAt: market.generatedAt,
      marketSummary: "Sem dados de mercado disponíveis no momento.",
      marketOverview: [],
      ai: {
        provider: "local",
        summary: "Não foi possível carregar dados do mercado. Tente novamente em alguns instantes.",
        confidence: 0,
        tradePlan: ["Verificar conectividade com a API de mercado.", "Validar símbolos ativos e rede.", "Recarregar painel quando a API estiver disponível."],
      },
      portfolio: {
        totalValue: Number(process.env.PORTFOLIO_CASH_USD || "50000"),
        allocations: [],
      },
    };
  }

  const portfolioValue = Number(process.env.PORTFOLIO_CASH_USD || "50000");
  const weights = [0.45, 0.35, 0.2];
  const colors = ["#22d3ee", "#a78bfa", "#34d399"];

  const allocations = marketOverview.slice(0, 3).map((item, index) => ({
    symbol: item.symbol,
    weight: Number((weights[index] * 100).toFixed(1)),
    value: Number((portfolioValue * weights[index]).toFixed(2)),
    color: colors[index] ?? "#22d3ee",
  }));

  const aiContext = await askAiForSummary(marketOverview);

  return {
    generatedAt: market.generatedAt,
    marketSummary: market.marketSummary,
    marketOverview,
    ai: {
      provider: aiContext.provider,
      summary: aiContext.summary,
      confidence: aiContext.confidence,
      tradePlan: buildTradePlan(marketOverview).slice(0, 3),
    },
    portfolio: {
      totalValue: portfolioValue,
      allocations,
    },
  };
}
