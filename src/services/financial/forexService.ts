// Forex data fetching and processing
import { FINNHUB_API_KEY, simulatedForexRates, ERROR_CODES, SIMULATED_DATA_TIMESTAMP } from './constants';
import type { ForexData, FinnhubForexResponse, ErrorData } from './types';

/**
 * Fetches forex exchange rates
 */
export async function fetchForexRates(baseCurrency: string, quoteCurrency: string): Promise<ForexData> {
  try {
    console.log(`Buscando taxas forex para ${baseCurrency}/${quoteCurrency}`);
    
    // Try using the Finnhub API
    const url = `https://finnhub.io/api/v1/forex/rates?base=${baseCurrency}&token=${FINNHUB_API_KEY}`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json() as FinnhubForexResponse;
      if (data.quote && data.quote[quoteCurrency]) {
        console.log(`Taxa forex recebida: ${data.quote[quoteCurrency]}`);
        return { 
          rate: data.quote[quoteCurrency],
          timestamp: Date.now(),
          simulated: false
        };
      }
      
      console.warn(`API Finnhub não retornou a taxa para ${quoteCurrency}`);
      throw createError(
        ERROR_CODES.DATA_PARSING_ERROR,
        `Dados da taxa ${baseCurrency}/${quoteCurrency} não disponíveis`,
        'Finnhub API'
      );
    } else {
      const errorStatus = `${response.status} ${response.statusText}`;
      const errorText = `Resposta da API Finnhub: ${errorStatus}`;
      console.error(errorText);
      
      // Try alternative API if available
      // Currently falling back to simulated data
      
      throw createError(
        ERROR_CODES.API_UNAVAILABLE,
        errorText,
        'Finnhub API'
      );
    }
  } catch (error) {
    console.error(`Erro ao buscar taxas forex para ${baseCurrency}/${quoteCurrency}:`, error);
    return handleForexError(baseCurrency, quoteCurrency, error);
  }
}

/**
 * Handles errors and falls back to simulated data
 */
function handleForexError(baseCurrency: string, quoteCurrency: string, error: unknown): ForexData {
  console.log(`Usando taxas forex simuladas para ${baseCurrency}/${quoteCurrency}`);
  const pair = `${baseCurrency}/${quoteCurrency}`;
  
  // Try to find the exact pair in simulated data
  if (simulatedForexRates[pair]) {
    return { 
      rate: simulatedForexRates[pair], 
      simulated: true,
      timestamp: SIMULATED_DATA_TIMESTAMP
    };
  }
  
  // Try to find the reverse pair in simulated data
  const reversePair = `${quoteCurrency}/${baseCurrency}`;
  if (simulatedForexRates[reversePair]) {
    return { 
      rate: 1 / simulatedForexRates[reversePair], 
      simulated: true,
      timestamp: SIMULATED_DATA_TIMESTAMP
    };
  }
  
  // Generate plausible random rate if pair not found
  console.warn(`Par forex ${pair} não encontrado em dados simulados. Gerando taxa aleatória.`);
  return { 
    rate: Math.random() * 2 + 0.5, 
    simulated: true,
    timestamp: SIMULATED_DATA_TIMESTAMP
  };
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
 * Checks if a string is a valid forex pair
 */
export function isValidForexPair(pair: string): boolean {
  // Check if it follows the standard 3-letter/3-letter format
  const regex = /^[A-Za-z]{3}\/[A-Za-z]{3}$/;
  return regex.test(pair);
}
