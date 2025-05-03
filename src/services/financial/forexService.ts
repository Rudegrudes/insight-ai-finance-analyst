
// Forex data fetching and processing
import { FINNHUB_API_KEY, simulatedForexRates, ERROR_CODES, SIMULATED_DATA_TIMESTAMP } from './constants';
import type { ForexData, FinnhubForexResponse, ErrorData } from './types';

/**
 * Fetches forex exchange rates
 * API endpoint documentação: https://finnhub.io/docs/api/forex-rates
 */
export async function fetchForexRates(baseCurrency: string, quoteCurrency: string): Promise<ForexData> {
  try {
    console.log(`Buscando taxas forex para ${baseCurrency}/${quoteCurrency}`);
    
    // Try using the Finnhub API with the correct endpoint
    const url = `https://finnhub.io/api/v1/forex/rates?base=${baseCurrency}&token=${FINNHUB_API_KEY}`;
    console.log(`Consultando API Finnhub: ${url}`);
    
    // Configuring proper fetch options to prevent caching and setting timeout
    const fetchOptions = { 
      cache: 'no-store', // Strictest no-cache option
      headers: {
        'Content-Type': 'application/json',
        'X-Finnhub-Token': FINNHUB_API_KEY  // Redundant header for some API implementations
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    };
    
    const response = await fetch(url, fetchOptions);
    
    if (response.ok) {
      const data = await response.json() as FinnhubForexResponse;
      console.log("Resposta da API Finnhub:", data);
      
      if (data && data.quote && data.quote[quoteCurrency]) {
        console.log(`Taxa forex recebida: ${data.quote[quoteCurrency]}`);
        return { 
          rate: data.quote[quoteCurrency],
          timestamp: Date.now(),
          simulated: false
        };
      } else if (data && data.quote && Object.keys(data.quote).length > 0) {
        // Se a moeda específica não estiver disponível, mas outros pares estiverem,
        // tentar calcular usando cross rate (por exemplo, via USD)
        console.log("Moeda específica não encontrada, tentando calcular via cross rate");
        const crossRate = calculateCrossRate(data.quote, baseCurrency, quoteCurrency);
        if (crossRate !== null) {
          return {
            rate: crossRate,
            timestamp: Date.now(),
            simulated: false,
            crossCalculated: true
          };
        }
      }
      
      console.warn(`API Finnhub não retornou a taxa para ${quoteCurrency}`);
      throw createError(
        ERROR_CODES.DATA_PARSING_ERROR,
        `Dados da taxa ${baseCurrency}/${quoteCurrency} não disponíveis`,
        'Finnhub API'
      );
    } else {
      const errorData = await response.text();
      const errorStatus = `${response.status} ${response.statusText}`;
      console.error(`Erro da API Finnhub: ${errorStatus}`, errorData);
      
      // Try alternative endpoint if the primary fails
      return await tryAlternativeForexEndpoint(baseCurrency, quoteCurrency);
    }
  } catch (error) {
    console.error(`Erro ao buscar taxas forex para ${baseCurrency}/${quoteCurrency}:`, error);
    
    if (error instanceof TypeError && error.message.includes('timeout')) {
      console.log("Timeout na conexão com API Finnhub, tentando endpoint alternativo");
      return await tryAlternativeForexEndpoint(baseCurrency, quoteCurrency);
    }
    
    return handleForexError(baseCurrency, quoteCurrency, error);
  }
}

/**
 * Tenta usar um endpoint alternativo da API Finnhub para forex
 */
async function tryAlternativeForexEndpoint(baseCurrency: string, quoteCurrency: string): Promise<ForexData> {
  try {
    // Usando o endpoint de quote direto para o par específico, quando disponível
    const symbol = `${baseCurrency}${quoteCurrency}`;
    const url = `https://finnhub.io/api/v1/quote?symbol=oanda:${symbol}&token=${FINNHUB_API_KEY}`;
    console.log(`Tentando endpoint alternativo: ${url}`);
    
    const response = await fetch(url, { 
      cache: 'no-store',
      signal: AbortSignal.timeout(10000)
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data && data.c) {
        console.log(`Taxa recebida via endpoint alternativo: ${data.c}`);
        return {
          rate: data.c,
          timestamp: Date.now(),
          simulated: false,
          source: 'alternative'
        };
      }
    }
    
    throw createError(
      ERROR_CODES.API_UNAVAILABLE,
      "Endpoint alternativo não retornou dados válidos",
      'Finnhub Alternative Endpoint'
    );
  } catch (error) {
    console.error("Erro no endpoint alternativo:", error);
    // Cai para os dados simulados
    return handleForexError(baseCurrency, quoteCurrency, error);
  }
}

/**
 * Calcula cross rate quando a cotação direta não está disponível
 * Por exemplo, EUR/BRL pode ser calculado via EUR/USD e USD/BRL
 */
function calculateCrossRate(quotes: Record<string, number>, baseCurrency: string, quoteCurrency: string): number | null {
  // Verificando se podemos calcular via USD como moeda intermediária
  if (quotes['USD'] && quotes[quoteCurrency]) {
    // Por exemplo, se base é EUR, precisamos EUR/USD e depois ajustar para o quote
    const baseToUSD = quotes['USD'];
    // Então pegamos a conversão de USD para a moeda alvo
    let usdToQuote = 0;
    
    // Procurando em todas as cotações disponíveis
    for (const [currPair, rate] of Object.entries(quotes)) {
      if (currPair === quoteCurrency) {
        usdToQuote = rate;
        break;
      }
    }
    
    if (usdToQuote !== 0) {
      const calculatedRate = baseToUSD * usdToQuote;
      console.log(`Taxa calculada via cross-rate USD: ${calculatedRate}`);
      return calculatedRate;
    }
  }
  
  return null;
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
