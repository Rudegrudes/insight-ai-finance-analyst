const FINNHUB_API_KEY = 'd09tc7hr01qus8rfaki0d09tc7hr01qus8rfakig'; // sua chave real
const FMP_API_KEY = 'UQD9TY699rUEYTpDNzKqq4EZD0FQ4LIj'; // sua chave real

export const generateFinancialAnalysis = async (query: string): Promise<string> => {
  try {
    const assetMatch = query.match(/\b([A-Z]{1,5}(?:\/[A-Z]{3})?)\b/i);

    if (!assetMatch) {
      return "Não pude identificar um código válido de ação ou par de moedas na sua consulta. Por favor, especifique uma ação (ex: AAPL) ou um par de moedas (ex: EUR/USD).";
    }

    const asset = assetMatch[1].toUpperCase();

    if (asset.includes('/')) {
      // Par de moedas - buscar dados na Finnhub
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
      // Ação - buscar dados na FMP
      const fmpUrl = `https://financialmodelingprep.com/api/v3/quote/${asset}?apikey=${FMP_API_KEY}`;
      const response = await fetch(fmpUrl);
      if (!response.ok) {
        throw new Error('Erro ao buscar dados da ação na FMP');
      }
      const data = await response.json();

      if (!data || data.length === 0) {
        return `Não foi possível obter dados para a ação ${asset}.`;
      }

      const stock = data[0];

      return `${asset} - Análise Fundamental em Tempo Real:\n\nPreço Atual: $${stock.price}\nVariação do Dia: ${stock.change} (${stock.changesPercentage}%)\nVolume: ${stock.volume}\n\nDados fornecidos pela Financial Modeling Prep.`;
    }
  } catch (error) {
    console.error('Erro ao gerar análise financeira:', error);
    return "Desculpe, ocorreu um erro ao gerar a análise financeira. Por favor, tente novamente mais tarde.";
  }
};
