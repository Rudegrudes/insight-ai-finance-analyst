import Fuse from 'fuse.js';

const FMP_API_KEY = 'UQD9TY699rUEYTpDNzKqq4EZD0FQ4LIj';
const FINNHUB_API_KEY = 'c7q3qv2ad3i9qv7qv7q0';

// Lista fixa de pares forex suportados (exemplo)
const forexSymbols = [
  'EURUSD', 'USDJPY', 'GBPUSD', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD', 'EURGBP', 'EURJPY', 'GBPJPY'
];

// Função para buscar lista de símbolos de ações da FMP
async function fetchStockSymbols(): Promise<string[]> {
  const url = `https://financialmodelingprep.com/api/v3/financial-statement-symbol-list?apikey=${FMP_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao buscar lista de símbolos da FMP');
  const data = await res.json();
  return data.map((item: any) => item.symbol.toUpperCase());
}

// Normaliza entrada do usuário
function normalizeInput(input: string): string {
  return input.toUpperCase().replace(/[^A-Z]/g, '');
}

// Cria Fuse para fuzzy search
function createFuse(list: string[]) {
  return new Fuse(list, {
    includeScore: true,
    threshold: 0.4,
  });
}

// Corrige símbolo com fuzzy search
async function correctSymbol(input: string): Promise<{ symbol: string; type: 'stock' | 'forex' } | null> {
  const normalized = normalizeInput(input);

  // Tenta forex
  const fuseForex = createFuse(forexSymbols);
  const forexResult = fuseForex.search(normalized);
  if (forexResult.length > 0) {
    return { symbol: forexResult[0].item, type: 'forex' };
  }

  // Tenta ações
  const stockSymbols = await fetchStockSymbols();
  const fuseStocks = createFuse(stockSymbols);
  const stockResult = fuseStocks.search(normalized);
  if (stockResult.length > 0) {
    return { symbol: stockResult[0].item, type: 'stock' };
  }

  return null;
}

// Função para buscar dados Forex na Finnhub
async function fetchForexData(symbol: string) {
  // Finnhub usa formato OANDA:EUR_USD para forex
  const formattedSymbol = `OANDA:${symbol.slice(0,3)}_${symbol.slice(3,6)}`;
  const url = `https://finnhub.io/api/v1/forex/rates?base=${symbol.slice(0,3)}&token=${FINNHUB_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao buscar dados Forex');
  const data = await res.json();
  return data;
}

// Função para buscar dados de ações na FMP
async function fetchStockData(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao buscar dados de ações');
  const data = await res.json();
  return data[0];
}

// Função principal para gerar análise financeira
export async function generateFinancialAnalysis(query: string): Promise<string> {
  try {
    const correction = await correctSymbol(query);
    if (!correction) {
      return "Não consegui identificar um símbolo válido para sua consulta. Por favor, tente novamente.";
    }

    const { symbol, type } = correction;

    if (type === 'forex') {
      const forexData = await fetchForexData(symbol);
      // Formate a resposta com dados forex
      return `Análise Forex para ${symbol}:\nTaxas atuais: ${JSON.stringify(forexData)}`;
    } else {
      const stockData = await fetchStockData(symbol);
      if (!stockData) return "Não encontrei dados para o símbolo informado.";
      // Formate a resposta com dados da ação
      return `Análise da ação ${stockData.name} (${stockData.symbol}):\nPreço atual: $${stockData.price}\nVariação: ${stockData.changesPercentage}%\nVolume: ${stockData.volume}`;
    }
  } catch (error) {
    console.error(error);
    return "Erro ao gerar análise financeira.";
  }
}
