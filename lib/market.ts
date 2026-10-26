type MarketPoint = {
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
};

const BINANCE_BASE_URL = process.env.BINANCE_BASE_URL || "https://api.binance.com";

function toNumber(value: unknown): number {
  return Number(value ?? 0);
}

function calculateEMA(values: number[], period: number): number {
  if (!values.length) return 0;
  const multiplier = 2 / (period + 1);
  let ema = values[0];
  for (let index = 1; index < values.length; index += 1) {
    ema = (values[index] - ema) * multiplier + ema;
  }
  return ema;
}

function calculateRSI(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let index = 1; index <= period; index += 1) {
    const delta = closes[index] - closes[index - 1];
    if (delta >= 0) gains += delta;
    else losses += Math.abs(delta);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function classifyTrend(ema9: number, ema21: number, rsi: number, changePercent: number): { trend: string; bias: string; signal: string; confidence: number } {
  const bullishBias = ema9 > ema21 && rsi > 55 && changePercent > 0;
  const bearishBias = ema9 < ema21 && rsi < 45 && changePercent < 0;

  if (bullishBias) {
    return {
      trend: "Alta",
      bias: "Long",
      signal: "COMPRA",
      confidence: Math.min(92, 60 + Math.abs(changePercent) * 9 + (rsi - 50) * 0.9),
    };
  }

  if (bearishBias) {
    return {
      trend: "Baixa",
      bias: "Short",
      signal: "VENDA",
      confidence: Math.min(90, 60 + Math.abs(changePercent) * 8 + (50 - rsi) * 1.05),
    };
  }

  return {
    trend: "Neutra",
    bias: "Espera",
    signal: "AGUARDE",
    confidence: 51,
  };
}

export async function getMarketOverview() {
  const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

  const market = await Promise.all(
    symbols.map(async (symbol) => {
      const tickerResponse = await fetch(`${BINANCE_BASE_URL}/api/v3/ticker/24hr?symbol=${symbol}`, { cache: "no-store" });
      if (!tickerResponse.ok) {
        throw new Error(`Erro ao consultar ${symbol}`);
      }

      const ticker = await tickerResponse.json();
      const klineResponse = await fetch(
        `${BINANCE_BASE_URL}/api/v3/klines?symbol=${symbol}&interval=1h&limit=200`,
        { cache: "no-store" }
      );

      if (!klineResponse.ok) {
        throw new Error(`Erro ao carregar candles de ${symbol}`);
      }

      const candles = await klineResponse.json();
      const closes = candles.map((candle: unknown[]) => toNumber(candle[4]));
      const price = toNumber(ticker.lastPrice);
      const changePercent = toNumber(ticker.priceChangePercent);
      const volume = toNumber(ticker.quoteVolume);
      const high = toNumber(ticker.highPrice);
      const low = toNumber(ticker.lowPrice);
      const ema9 = calculateEMA(closes, 9);
      const ema21 = calculateEMA(closes, 21);
      const rsi = calculateRSI(closes, 14);
      const classification = classifyTrend(ema9, ema21, rsi, changePercent);

      return {
        symbol,
        price,
        changePercent,
        volume,
        high,
        low,
        signal: classification.signal,
        trend: classification.trend,
        bias: classification.bias,
        confidence: Number(classification.confidence.toFixed(0)),
        rsi: Number(rsi.toFixed(1)),
        ema9: Number(ema9.toFixed(2)),
        ema21: Number(ema21.toFixed(2)),
      } satisfies MarketPoint;
    })
  );

  const averageChange = market.reduce((sum, item) => sum + item.changePercent, 0) / market.length;
  const summary =
    averageChange >= 0
      ? "O contexto de mercado está positivo com tendência favorável para ativos de alta liquidez."
      : "O mercado está em fase defensiva com maior pressão sobre ativos de risco, exigindo entradas mais seletivas.";

  return {
    generatedAt: new Date().toISOString(),
    marketSummary: summary,
    marketOverview: market,
  };
}
