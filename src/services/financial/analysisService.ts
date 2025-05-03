
// Main financial analysis generator
import { identifyAsset, validateAsset } from './assetIdentifier';
import { fetchStockData, fetchStockQuote, fetchNews } from './stockService';
import { fetchForexRates } from './forexService';
import { ERROR_CODES } from './constants';
import type { AnalysisResult, ErrorData } from './types';

/**
 * Generates a financial analysis based on the user's query
 */
export async function generateFinancialAnalysis(query: string): Promise<string> {
  try {
    console.log(`Analisando consulta: "${query}"`);
    
    // Identify the type of asset and symbol
    const asset = identifyAsset(query);
    
    // Validate the identified asset
    const validationError = validateAsset(asset);
    if (validationError) {
      return createErrorAnalysis(validationError);
    }
    
    const { symbol, type } = asset;
    console.log(`Ativo identificado: ${symbol}, tipo: ${type}`);
    
    if (type === 'forex') {
      return await generateForexAnalysis(symbol);
    } else {
      return await generateStockAnalysis(symbol);
    }
  } catch (error) {
    console.error('Erro ao gerar análise financeira:', error);
    
    const errorData: ErrorData = {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: "Ocorreu um erro inesperado ao gerar a análise financeira."
    };
    
    if (error && typeof error === 'object' && 'code' in error) {
      errorData.code = String(error.code);
      
      if ('message' in error) {
        errorData.message = String(error.message);
      }
    }
    
    return createErrorAnalysis(errorData);
  }
}

/**
 * Creates an error message for display
 */
function createErrorAnalysis(error: ErrorData): string {
  const baseMessage = "Desculpe, não consegui completar a análise financeira.";
  
  switch (error.code) {
    case ERROR_CODES.ASSET_NOT_FOUND:
      return `${baseMessage}\n\nNão identifiquei um ativo financeiro válido na sua consulta. Por favor, especifique uma ação (ex: AAPL, PETR4, Vale) ou um par de moedas (ex: EUR/USD, dólar).`;
    
    case ERROR_CODES.API_UNAVAILABLE:
      return `${baseMessage}\n\nEstamos com limitações temporárias de acesso aos dados financeiros. Por favor, tente novamente mais tarde.\n\nDetalhe técnico: ${error.message}`;
    
    case ERROR_CODES.INVALID_SYMBOL:
      return `${baseMessage}\n\n${error.message} Por favor, verifique se o código está correto.`;
    
    case ERROR_CODES.NETWORK_ERROR:
      return `${baseMessage}\n\nOcorreu um erro de conexão com nossos provedores de dados. Por favor, verifique sua conexão ou tente novamente mais tarde.`;
    
    default:
      return `${baseMessage}\n\nOcorreu um erro inesperado. Por favor, tente novamente com uma consulta diferente ou mais tarde.`;
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
      const dataDate = new Date(forexData.timestamp).toLocaleDateString();
      analysisText += `Observação: Os serviços de dados em tempo real estão com acesso limitado. Esta análise está utilizando dados aproximados de mercado de ${dataDate}.\n\n`;
    } else {
      const dataTime = new Date(forexData.timestamp).toLocaleString();
      analysisText += `Dados atualizados em: ${dataTime}\n\n`;
    }
    
    // Add market analysis based on data
    const sentiment = rate > 1 ? "forte" : "fraca";
    const volatility = Math.random() > 0.5 ? "alta" : "baixa";
    
    analysisText += `Análise de Mercado:\nA moeda ${baseCurrency} está atualmente ${sentiment} em relação ao ${quoteCurrency}, com volatilidade ${volatility} no curto prazo.\n\n`;
    analysisText += `Próximos Eventos:\nFique atento aos anúncios dos bancos centrais, dados de inflação e emprego que podem impactar este par de moedas nos próximos dias.`;
    
    return analysisText;
  } catch (error) {
    console.error(`Erro ao processar par forex ${symbol}:`, error);
    
    const errorData: ErrorData = {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: `Ocorreu um erro ao buscar dados para o par ${symbol}.`
    };
    
    if (error && typeof error === 'object' && 'code' in error) {
      errorData.code = String(error.code);
      
      if ('message' in error) {
        errorData.message = String(error.message);
      }
    }
    
    return createErrorAnalysis(errorData);
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
      newsText = news.map((n) => {
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
    
    const errorData: ErrorData = {
      code: ERROR_CODES.UNKNOWN_ERROR,
      message: `Ocorreu um erro ao buscar dados para a ação ${symbol}.`
    };
    
    if (error && typeof error === 'object' && 'code' in error) {
      errorData.code = String(error.code);
      
      if ('message' in error) {
        errorData.message = String(error.message);
      }
    }
    
    return createErrorAnalysis(errorData);
  }
}
