
const FINNHUB_API_KEY = 'c7q3qv2ad3i9qv7qv7q0';
const FMP_API_KEY = 'UQD9TY699rUEYTpDNzKqq4EZD0FQ4LIj';

// Mapa de nomes comuns para símbolos de ações brasileiras
const companyNameToSymbol = {
  'banco do brasil': 'BBAS3',
  'bradesco': 'BBDC4',
  'itau': 'ITUB4',
  'itaú': 'ITUB4',
  'vale': 'VALE3',
  'petrobras': 'PETR4',
  'ambev': 'ABEV3',
  'b3': 'B3SA3',
  'magazine luiza': 'MGLU3',
  'magalu': 'MGLU3',
  'itausa': 'ITSA4',
  'santander': 'SANB11',
  'weg': 'WEGE3'
};

// Mapa de símbolos de pares de moedas com variações de formato
const forexPairs = {
  'eurusd': 'EUR/USD',
  'eur/usd': 'EUR/USD',
  'eur-usd': 'EUR/USD',
  'eur usd': 'EUR/USD',
  'usdjpy': 'USD/JPY',
  'usd/jpy': 'USD/JPY',
  'usd-jpy': 'USD/JPY',
  'usd jpy': 'USD/JPY',
  'gbpusd': 'GBP/USD',
  'gbp/usd': 'GBP/USD',
  'gbp-usd': 'GBP/USD',
  'gbp usd': 'GBP/USD',
  'usdcad': 'USD/CAD',
  'usd/cad': 'USD/CAD',
  'usd-cad': 'USD/CAD',
  'usd cad': 'USD/CAD'
};

async function fetchStockData(symbol: string) {
  try {
    console.log(`Buscando dados da ação ${symbol} na FMP`);
    const url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar dados da ação na FMP');
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error(`Nenhum dado encontrado para o símbolo ${symbol}`);
    }
    
    return data[0]; // perfil da empresa
  } catch (error) {
    console.error(`Erro ao buscar dados da ação ${symbol}:`, error);
    throw error;
  }
}

async function fetchStockQuote(symbol: string) {
  try {
    console.log(`Buscando cotação da ação ${symbol} na FMP`);
    const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar cotação da ação na FMP');
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error(`Nenhuma cotação encontrada para o símbolo ${symbol}`);
    }
    
    return data[0];
  } catch (error) {
    console.error(`Erro ao buscar cotação da ação ${symbol}:`, error);
    throw error;
  }
}

async function fetchNews(symbol: string) {
  try {
    console.log(`Buscando notícias para ${symbol} na Finnhub`);
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${getDateNDaysAgo(30)}&to=${getDateToday()}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar notícias na Finnhub');
    const data = await response.json();
    console.log(`Notícias recebidas: ${data.length}`);
    return data.slice(0, 5); // pegar as 5 notícias mais recentes
  } catch (error) {
    console.error(`Erro ao buscar notícias para ${symbol}:`, error);
    return []; // retornar array vazio em caso de erro para não quebrar o fluxo
  }
}

async function fetchForexRates(baseCurrency: string) {
  try {
    console.log(`Buscando taxas forex para ${baseCurrency} na Finnhub`);
    const url = `https://finnhub.io/api/v1/forex/rates?base=${baseCurrency}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Resposta da API Finnhub: ${response.status} ${response.statusText}`);
      throw new Error('Erro ao buscar dados de Forex na Finnhub');
    }
    
    const data = await response.json();
    console.log(`Dados forex recebidos:`, data);
    return data;
  } catch (error) {
    console.error(`Erro ao buscar taxas forex para ${baseCurrency}:`, error);
    throw error;
  }
}

function getDateNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function getDateToday() {
  return new Date().toISOString().split('T')[0];
}

// Nova função para identificar o tipo de ativo e extrair o símbolo correto
function identifyAsset(query: string): { symbol: string, type: 'stock' | 'forex' | null } {
  // Normalizar a consulta removendo acentos, convertendo para minúsculo
  const normalizedQuery = query.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  console.log(`Consulta normalizada: "${normalizedQuery}"`);
  
  // Verificar se corresponde a um nome de empresa conhecido
  for (const [company, symbol] of Object.entries(companyNameToSymbol)) {
    if (normalizedQuery.includes(company)) {
      console.log(`Empresa encontrada: ${company} -> ${symbol}`);
      return { symbol, type: 'stock' };
    }
  }
  
  // Verificar se corresponde a um par de forex conhecido
  for (const [pair, formattedPair] of Object.entries(forexPairs)) {
    if (normalizedQuery.includes(pair)) {
      console.log(`Par forex encontrado: ${pair} -> ${formattedPair}`);
      return { symbol: formattedPair, type: 'forex' };
    }
  }
  
  // Verificar padrões de símbolo de ação (letras maiúsculas seguidas de números opcionais)
  const stockPattern = /\b([A-Za-z]{2,5}\d{0,2})\b/;
  const stockMatch = query.match(stockPattern);
  if (stockMatch) {
    console.log(`Padrão de ação encontrado: ${stockMatch[1]}`);
    return { symbol: stockMatch[1].toUpperCase(), type: 'stock' };
  }
  
  // Verificar padrão de par de moedas (3 letras / 3 letras)
  const forexPattern = /\b([A-Za-z]{3})[\/\s-]?([A-Za-z]{3})\b/i;
  const forexMatch = query.match(forexPattern);
  if (forexMatch) {
    const formattedPair = `${forexMatch[1].toUpperCase()}/${forexMatch[2].toUpperCase()}`;
    console.log(`Padrão de forex encontrado: ${formattedPair}`);
    return { symbol: formattedPair, type: 'forex' };
  }
  
  return { symbol: '', type: null };
}

export const generateFinancialAnalysis = async (query: string): Promise<string> => {
  try {
    console.log(`Analisando consulta: "${query}"`);
    
    // Identificar o tipo de ativo e símbolo
    const { symbol, type } = identifyAsset(query);
    
    if (!symbol || !type) {
      return "Não pude identificar um código válido de ação ou par de moedas na sua consulta. Por favor, especifique uma ação (ex: AAPL, BBAS3) ou um par de moedas (ex: EUR/USD).";
    }
    
    console.log(`Ativo identificado: ${symbol}, tipo: ${type}`);
    
    if (type === 'forex') {
      // Processar par de moedas
      try {
        const [baseCurrency, quoteCurrency] = symbol.split('/');
        console.log(`Processando par forex: ${baseCurrency}/${quoteCurrency}`);
        
        const forexData = await fetchForexRates(baseCurrency);
        
        if (!forexData.quote || !forexData.quote[quoteCurrency]) {
          return `Não foi possível obter a taxa de câmbio para o par ${symbol}.`;
        }
        
        const rate = forexData.quote[quoteCurrency];
        
        return `${symbol} - Análise de Forex em Tempo Real:\n\nTaxa de câmbio atual: 1 ${baseCurrency} = ${rate} ${quoteCurrency}\n\nObservação: Dados fornecidos pela Finnhub.`;
      } catch (error) {
        console.error(`Erro ao processar par forex ${symbol}:`, error);
        return `Ocorreu um erro ao buscar dados para o par ${symbol}. Por favor, verifique se o par de moedas é válido e tente novamente.`;
      }
    } else {
      // Processar ação
      try {
        console.log(`Processando ação: ${symbol}`);
        const profile = await fetchStockData(symbol);
        const quote = await fetchStockQuote(symbol);
        const news = await fetchNews(symbol);
        
        let newsText = 'Nenhuma notícia recente disponível.';
        if (news && news.length > 0) {
          newsText = news.map((n: any) => {
            const date = n.datetime ? new Date(n.datetime * 1000).toLocaleDateString() : 'Data não disponível';
            return `• ${n.headline || 'Sem título'} (${date})`;
          }).join('\n');
        }

        return `${symbol} - Análise Fundamental em Tempo Real:\n\nVisão Geral da Empresa:\n${profile.companyName} é uma empresa do setor ${profile.sector || 'não informado'}, com sede em ${profile.country || 'não informado'}.\n\nMétricas Financeiras Chave:\n• Valor de Mercado: $${(profile.mktCap / 1e9).toFixed(2)} bilhões\n• Índice P/L: ${profile.pe || 'N/A'}\n• Dividend Yield: ${profile.dividendYield || 'N/A'}\n• Setor: ${profile.sector || 'N/A'}\n\nDesempenho Recente:\n• Preço Atual: $${quote.price}\n• Variação do Dia: ${quote.change} (${quote.changesPercentage}%)\n\nNotícias Recentes:\n${newsText}\n\nResumo:\nCom base nos dados atuais, ${profile.companyName} apresenta um desempenho financeiro que deve ser monitorado de perto, considerando as notícias recentes e indicadores financeiros.`;
      } catch (error) {
        console.error(`Erro ao processar ação ${symbol}:`, error);
        return `Ocorreu um erro ao buscar dados para a ação ${symbol}. Por favor, verifique se o código da ação é válido e tente novamente.`;
      }
    }
  } catch (error) {
    console.error('Erro ao gerar análise financeira:', error);
    return "Desculpe, ocorreu um erro ao gerar a análise financeira. Por favor, tente novamente mais tarde.";
  }
};
