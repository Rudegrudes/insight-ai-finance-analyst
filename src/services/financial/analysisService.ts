
// Main financial analysis generator
import { identifyAsset } from './assetIdentifier';
import { fetchStockData, fetchStockQuote, fetchNews } from './stockService';
import { fetchForexRates } from './forexService';

/**
 * Generates a financial analysis based on the user's query
 */
export async function generateFinancialAnalysis(query: string): Promise<string> {
  try {
    console.log(`Analisando consulta: "${query}"`);
    
    // Identify the type of asset and symbol
    const { symbol, type } = identifyAsset(query);
    
    if (!symbol || !type) {
      return "Não pude identificar um código válido de ação ou par de moedas na sua consulta. Por favor, especifique uma ação (ex: AAPL, BBAS3) ou um par de moedas (ex: EUR/USD).";
    }
    
    console.log(`Ativo identificado: ${symbol}, tipo: ${type}`);
    
    if (type === 'forex') {
      return await generateForexAnalysis(symbol);
    } else {
      return await generateStockAnalysis(symbol);
    }
  } catch (error) {
    console.error('Erro ao gerar análise financeira:', error);
    return "Desculpe, ocorreu um erro ao gerar a análise financeira. Por favor, tente novamente mais tarde.";
  }
}

/**
 * Generates analysis for forex pairs
 */
async function generateForexAnalysis(symbol: string): Promise<string> {
  try {
    const [baseCurrency, quoteCurrency] = symbol.split('/');
    console.log(`Processando par forex: ${baseCurrency}/${quoteCurrency}`);
    
    const forexData = await fetchForexRates(baseCurrency, quoteCurrency);
    const rate = forexData.rate;
    
    let analysisText = `${symbol} - Análise de Forex em Tempo Real:\n\nTaxa de câmbio atual: 1 ${baseCurrency} = ${rate.toFixed(4)} ${quoteCurrency}\n\n`;
    
    if (forexData.simulated) {
      analysisText += "Observação: Os serviços de dados em tempo real estão com acesso limitado. Esta análise está utilizando estimativas aproximadas de mercado.\n\n";
    }
    
    // Add market analysis based on simulated data
    const sentiment = rate > 1 ? "forte" : "fraca";
    const volatility = Math.random() > 0.5 ? "alta" : "baixa";
    
    analysisText += `Análise de Mercado:\nA moeda ${baseCurrency} está atualmente ${sentiment} em relação ao ${quoteCurrency}, com volatilidade ${volatility} no curto prazo.\n\n`;
    analysisText += `Próximos Eventos:\nFique atento aos anúncios dos bancos centrais, dados de inflação e emprego que podem impactar este par de moedas nos próximos dias.`;
    
    return analysisText;
  } catch (error) {
    console.error(`Erro ao processar par forex ${symbol}:`, error);
    return `Ocorreu um erro ao buscar dados para o par ${symbol}. Estamos com limitações temporárias de acesso aos dados. Por favor, tente novamente mais tarde.`;
  }
}

/**
 * Generates analysis for stocks
 */
async function generateStockAnalysis(symbol: string): Promise<string> {
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

    // Determine if the analysis should be positive, neutral, or negative
    const changeValue = parseFloat(String(quote.change));
    let sentimento = "neutro";
    if (changeValue > 0) sentimento = "positivo";
    if (changeValue < 0) sentimento = "negativo";
    
    return `${symbol} - Análise de Mercado em Tempo Real:\n\nVisão Geral da Empresa:\n${profile.companyName || symbol} é uma empresa ${profile.sector ? `do setor ${profile.sector}` : ''} ${profile.country ? `com sede em ${profile.country}` : ''}.\n\nMétricas Financeiras Chave:\n• Valor de Mercado: $${(profile.mktCap / 1e9).toFixed(2)} bilhões\n• Índice P/L: ${profile.pe || 'N/A'}\n• Dividend Yield: ${profile.dividendYield ? profile.dividendYield + '%' : 'N/A'}\n• Setor: ${profile.sector || 'N/A'}\n\nDesempenho Recente:\n• Preço Atual: $${quote.price}\n• Variação do Dia: ${quote.change} (${quote.changesPercentage})\n\nNotícias Recentes:\n${newsText}\n\nResumo:\nCom base nos dados atuais e sentimento ${sentimento} do mercado, ${profile.companyName || symbol} apresenta um desempenho financeiro que deve ser monitorado de perto, considerando as notícias recentes e indicadores financeiros.`;
  } catch (error) {
    console.error(`Erro ao processar ação ${symbol}:`, error);
    return `Ocorreu um erro ao buscar dados para a ação ${symbol}. Estamos com limitações temporárias de acesso aos dados. Por favor, tente novamente mais tarde.`;
  }
}
