const FINNHUB_API_KEY = 'd09tc7hr01qus8rfaki0d09tc7hr01qus8rfakig';
const FMP_API_KEY = 'UQD9TY699rUEYTpDNzKqq4EZD0FQ4LIj';

async function fetchStockData(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${FMP_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erro ao buscar dados da ação na FMP');
  const data = await response.json();
  return data[0]; // perfil da empresa
}

async function fetchStockQuote(symbol: string) {
  const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erro ao buscar cotação da ação na FMP');
  const data = await response.json();
  return data[0];
}

async function fetchNews(symbol: string) {
  const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${getDateNDaysAgo(30)}&to=${getDateToday()}&token=${FINNHUB_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erro ao buscar notícias na Finnhub');
  const data = await response.json();
  return data.slice(0, 5); // pegar as 5 notícias mais recentes
}

function getDateNDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

function getDateToday() {
  return new Date().toISOString().split('T')[0];
}

export const generateFinancialAnalysis = async (query: string): Promise<string> => {
  try {
    const assetMatch = query.match(/\b([A-Z]{1,5}(?:\/[A-Z]{3})?)\b/i);

    if (!assetMatch) {
      return "Não pude identificar um código válido de ação ou par de moedas na sua consulta. Por favor, especifique uma ação (ex: AAPL) ou um par de moedas (ex: EUR/USD).";
    }

    const asset = assetMatch[1].toUpperCase();

    if (asset.includes('/')) {
      // Par de moedas - manter análise simplificada
      const [baseCurrency, quoteCurrency] = asset.split('/');

      const finnhubUrl = `https://finnhub.io/api/v1/forex/rates?base=${baseCurrency}&token=${FINNHUB_API_KEY}`;
      const response = await fetch(finnhubUrl);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados de Forex na Finnhub');
      }
      const data = await response.json();

      const rate = data.quote ? data.quote[quoteCurrency] : null;
      if (!rate) {
        return `Não foi possível obter a taxa de câmbio para o par ${asset}.`;
      }

      return `${asset} - Análise de Forex em Tempo Real:\n\nTaxa de câmbio atual: 1 ${baseCurrency} = ${rate} ${quoteCurrency}\n\nObservação: Dados fornecidos pela Finnhub.`;
    } else {
      // Ação - buscar dados e notícias reais
      const profile = await fetchStockData(asset);
      const quote = await fetchStockQuote(asset);
      const news = await fetchNews(asset);

      if (!profile || !quote) {
        return `Não foi possível obter dados para a ação ${asset}.`;
      }

      // Montar texto no formato narrativo parecido com o modelo antigo
      let newsText = news.length > 0 ? news.map(n => `• ${n.headline} (${new Date(n.datetime * 1000).toLocaleDateString()})`).join('\n') : 'Nenhuma notícia recente disponível.';

      return `${asset} - Análise Fundamental em Tempo Real:\n\nVisão Geral da Empresa:\n${profile.companyName} é uma empresa do setor ${profile.sector}, com sede em ${profile.country}.\n\nMétricas Financeiras Chave:\n• Valor de Mercado: $${(profile.mktCap / 1e9).toFixed(2)} bilhões\n• Índice P/L: ${profile.pe}\n• Dividend Yield: ${profile.dividendYield || 'N/A'}\n• Setor: ${profile.sector}\n\nDesempenho Recente:\n• Preço Atual: $${quote.price}\n• Variação do Dia: ${quote.change} (${quote.changesPercentage}%)\n\nNotícias Recentes:\n${newsText}\n\nResumo:\nCom base nos dados atuais, ${profile.companyName} apresenta um desempenho financeiro que deve ser monitorado de perto, considerando as notícias recentes e indicadores financeiros.`;
    }
  } catch (error) {
    console.error('Erro ao gerar análise financeira:', error);
    return "Desculpe, ocorreu um erro ao gerar a análise financeira. Por favor, tente novamente mais tarde.";
  }
};
