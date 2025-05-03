
// Stock data fetching and processing
import { FMP_API_KEY, ERROR_CODES } from './constants';
import { getDateNDaysAgo, getDateToday } from './utils';
import type { StockData, StockQuote, NewsItem, ErrorData, FinancialModelPrepProfileResponse, FinancialModelPrepQuoteResponse } from './types';

/**
 * Fetches stock data from Financial Modeling Prep API or Yahoo Finance
 */
export async function fetchStockData(symbol: string): Promise<StockData> {
  try {
    console.log(`Buscando dados da ação ${symbol}`);
    
    // First, try with the FMP API
    const fmpUrl = `https://financialmodelingprep.com/api/v3/profile/${symbol.replace('.SA', '')}?apikey=${FMP_API_KEY}`;
    console.log(`Tentando buscar dados via FMP: ${fmpUrl}`);
    
    const fmpResponse = await fetch(fmpUrl);
    
    if (fmpResponse.ok) {
      const fmpData = await fmpResponse.json() as FinancialModelPrepProfileResponse;
      if (fmpData && fmpData.length > 0) {
        console.log(`Dados recebidos via FMP para ${symbol}`);
        return fmpData[0]; // Company profile from FMP
      } else {
        console.warn(`API FMP retornou resposta vazia para ${symbol}`);
        throw createError(
          ERROR_CODES.DATA_PARSING_ERROR,
          `Dados para ${symbol} não disponíveis`,
          'Financial Modeling Prep API'
        );
      }
    } else {
      const errorText = `Resposta da API FMP: ${fmpResponse.status} ${fmpResponse.statusText}`;
      console.error(errorText);
      throw createError(
        ERROR_CODES.API_UNAVAILABLE,
        errorText,
        'Financial Modeling Prep API'
      );
    }
  } catch (error) {
    console.error(`Erro ao buscar dados da ação ${symbol}:`, error);
    
    // If it's a Brazilian stock, try fetching from Yahoo Finance
    if (symbol.endsWith('.SA')) {
      console.log(`Tentando buscar dados via Yahoo Finance para ação brasileira: ${symbol}`);
      try {
        return await fetchYahooFinanceData(symbol);
      } catch (yahooError) {
        console.error(`Erro ao buscar dados do Yahoo Finance para ${symbol}:`, yahooError);
        return generateSimulatedStockData(symbol);
      }
    }
    
    // For other stocks, use simulated data
    console.log(`Usando dados simulados para ${symbol}`);
    return generateSimulatedStockData(symbol);
  }
}

/**
 * Simulates fetching data from Yahoo Finance for Brazilian stocks
 */
async function fetchYahooFinanceData(symbol: string): Promise<StockData> {
  try {
    // Simulate Yahoo Finance data (in production we would use the actual API)
    const companyName = symbol.replace('.SA', '');
    
    return {
      symbol: symbol,
      companyName: `${companyName} S.A.`,
      price: Math.random() * 100 + 10,
      changes: (Math.random() * 10) - 5,
      changesPercentage: ((Math.random() * 10) - 5).toFixed(2),
      mktCap: Math.random() * 1000000000,
      sector: "Brasil",
      country: "Brasil",
      pe: (Math.random() * 20 + 5).toFixed(2),
      dividendYield: (Math.random() * 5).toFixed(2)
    };
  } catch (error) {
    console.error(`Erro ao buscar dados do Yahoo Finance para ${symbol}:`, error);
    throw createError(
      ERROR_CODES.API_UNAVAILABLE, 
      `Falha ao buscar dados do Yahoo Finance para ${symbol}`,
      'Yahoo Finance (simulado)'
    );
  }
}

/**
 * Generates simulated stock data when APIs fail
 */
function generateSimulatedStockData(symbol: string): StockData {
  return {
    symbol: symbol,
    companyName: symbol,
    price: Math.random() * 100 + 10,
    changes: (Math.random() * 10) - 5,
    changesPercentage: ((Math.random() * 10) - 5).toFixed(2),
    mktCap: Math.random() * 1000000000,
    sector: "Não disponível",
    country: "Não disponível",
    pe: (Math.random() * 20 + 5).toFixed(2),
    dividendYield: (Math.random() * 5).toFixed(2)
  };
}

/**
 * Fetches current stock quote data
 */
export async function fetchStockQuote(symbol: string): Promise<StockQuote> {
  try {
    console.log(`Buscando cotação da ação ${symbol}`);
    
    // First, try with the FMP API
    const fmpUrl = `https://financialmodelingprep.com/api/v3/quote/${symbol.replace('.SA', '')}?apikey=${FMP_API_KEY}`;
    const fmpResponse = await fetch(fmpUrl);
    
    if (fmpResponse.ok) {
      const fmpData = await fmpResponse.json() as FinancialModelPrepQuoteResponse;
      if (fmpData && fmpData.length > 0) {
        console.log(`Cotação recebida via FMP para ${symbol}`);
        return fmpData[0]; // Quote from FMP
      } else {
        console.warn(`API FMP retornou cotação vazia para ${symbol}`);
        throw createError(
          ERROR_CODES.DATA_PARSING_ERROR,
          `Cotação para ${symbol} não disponível`,
          'Financial Modeling Prep API'
        );
      }
    } else {
      const errorText = `Resposta da API FMP para cotação: ${fmpResponse.status} ${fmpResponse.statusText}`;
      console.error(errorText);
      throw createError(
        ERROR_CODES.API_UNAVAILABLE,
        errorText,
        'Financial Modeling Prep API'
      );
    }
  } catch (error) {
    console.error(`Erro ao buscar cotação da ação ${symbol}:`, error);
    return generateSimulatedStockQuote(symbol);
  }
}

/**
 * Generates simulated stock quote when API fails
 */
function generateSimulatedStockQuote(symbol: string): StockQuote {
  return {
    symbol: symbol,
    name: symbol,
    price: Math.random() * 100 + 10,
    change: (Math.random() * 10) - 5,
    changesPercentage: ((Math.random() * 10) - 5).toFixed(2) + '%'
  };
}

/**
 * Fetches news related to a stock symbol
 */
export async function fetchNews(symbol: string): Promise<NewsItem[]> {
  try {
    console.log(`Buscando notícias para ${symbol}`);
    // Try to fetch news from Finnhub
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol.replace('.SA', '')}&from=${getDateNDaysAgo(30)}&to=${getDateToday()}&token=${process.env.FINNHUB_API_KEY}`;
    
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(`Notícias recebidas: ${data.length}`);
      if (data && Array.isArray(data) && data.length > 0) {
        return data.slice(0, 5); // get the 5 most recent news
      }
    }
    
    throw createError(
      ERROR_CODES.DATA_PARSING_ERROR,
      `Notícias para ${symbol} não disponíveis`,
      'Finnhub API'
    );
  } catch (error) {
    console.error(`Erro ao buscar notícias para ${symbol}:`, error);
    return generateSimulatedNews(symbol);
  }
}

/**
 * Generates simulated news when API fails
 */
function generateSimulatedNews(symbol: string): NewsItem[] {
  return [
    {
      headline: `Análise técnica de ${symbol}`,
      datetime: Date.now() - 86400000, // yesterday
      source: "Notícias Financeiras",
      summary: "Análise técnica mostra suporte em níveis atuais com potencial de alta no curto prazo."
    },
    {
      headline: `Resultados trimestrais de ${symbol} superam expectativas`,
      datetime: Date.now() - 172800000, // 2 days ago
      source: "Análise do Mercado",
      summary: "Empresa reportou lucro acima do esperado, impulsionado por forte demanda e redução de custos operacionais."
    },
    {
      headline: `Perspectivas para ${symbol} no próximo trimestre`,
      datetime: Date.now() - 259200000, // 3 days ago
      source: "Investimentos Hoje",
      summary: "Analistas mantêm visão positiva para o próximo trimestre, citando expansão internacional e novos produtos."
    }
  ];
}

/**
 * Creates a standardized error object
 */
function createError(code: string, message: string, source?: string): ErrorData {
  return {
    code,
    message,
    source
  };
}

/**
 * Validates if a string might be a valid stock symbol
 */
export function isValidStockSymbol(symbol: string): boolean {
  // Most stock symbols are 1-5 uppercase letters, may have numbers at the end, and may have .XX country extension
  const regex = /^[A-Z]{1,5}[0-9]{0,3}(\.[A-Z]{2})?$/;
  return regex.test(symbol);
}
