
// Forex data fetching and processing
import { FINNHUB_API_KEY, simulatedForexRates } from './constants';
import type { ForexData } from './types';

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
      const data = await response.json();
      if (data.quote && data.quote[quoteCurrency]) {
        console.log(`Taxa forex recebida: ${data.quote[quoteCurrency]}`);
        return { rate: data.quote[quoteCurrency] };
      }
    } else {
      console.error(`Resposta da API Finnhub: ${response.status} ${response.statusText}`);
    }
    
    // If the API fails, use simulated data
    console.log(`Usando taxas forex simuladas para ${baseCurrency}/${quoteCurrency}`);
    const pair = `${baseCurrency}/${quoteCurrency}`;
    
    if (simulatedForexRates[pair]) {
      return { rate: simulatedForexRates[pair], simulated: true };
    }
    
    // If the reverse pair exists in the simulated data, calculate the inverse
    const reversePair = `${quoteCurrency}/${baseCurrency}`;
    if (simulatedForexRates[reversePair]) {
      return { rate: 1 / simulatedForexRates[reversePair], simulated: true };
    }
    
    // If still not found, return a plausible random value
    return { 
      rate: Math.random() * 2 + 0.5, 
      simulated: true
    };
  } catch (error) {
    console.error(`Erro ao buscar taxas forex para ${baseCurrency}/${quoteCurrency}:`, error);
    return { 
      rate: Math.random() * 2 + 0.5, 
      simulated: true
    };
  }
}
