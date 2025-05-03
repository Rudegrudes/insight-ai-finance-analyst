
// Asset identification logic
import { companyNameToSymbol, popularUSStocks, forexPairs, ERROR_CODES } from './constants';
import { isValidStockSymbol } from './stockService';
import { isValidForexPair } from './forexService';
import type { AssetIdentification, ErrorData } from './types';

/**
 * Identifies the type of asset from the query and returns the appropriate symbol
 */
export function identifyAsset(query: string): AssetIdentification {
  // Normalize the query by removing accents and converting to lowercase
  const normalizedQuery = query.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  console.log(`Consulta normalizada: "${normalizedQuery}"`);
  
  // Check if it matches a known Brazilian company name
  for (const [company, symbol] of Object.entries(companyNameToSymbol)) {
    if (normalizedQuery.includes(company)) {
      console.log(`Empresa brasileira encontrada: ${company} -> ${symbol}`);
      return { symbol, type: 'stock' };
    }
  }
  
  // Check if it matches a known US company name
  for (const [company, symbol] of Object.entries(popularUSStocks)) {
    if (normalizedQuery.includes(company)) {
      console.log(`Empresa americana encontrada: ${company} -> ${symbol}`);
      return { symbol, type: 'stock' };
    }
  }
  
  // Check if it matches a known forex pair
  for (const [pair, formattedPair] of Object.entries(forexPairs)) {
    if (normalizedQuery.includes(pair)) {
      console.log(`Par forex encontrado: ${pair} -> ${formattedPair}`);
      return { symbol: formattedPair, type: 'forex' };
    }
  }
  
  // Check for stock symbol patterns (2-5 letters possibly followed by 0-2 numbers)
  const stockPattern = /\b([A-Za-z]{2,5}\d{0,2})\b/;
  const stockMatch = query.match(stockPattern);
  if (stockMatch) {
    const symbol = stockMatch[1].toUpperCase();
    console.log(`Padrão de ação encontrado: ${symbol}`);
    
    // Check if it's a Brazilian stock pattern (4 letters followed by 1 number)
    if (/^[A-Z]{4}\d{1}$/.test(symbol)) {
      return { symbol: `${symbol}.SA`, type: 'stock' };
    }
    
    return { symbol, type: 'stock' };
  }
  
  // Check for forex pair patterns (3 letters / 3 letters)
  const forexPattern = /\b([A-Za-z]{3})[\/\s-]?([A-Za-z]{3})\b/i;
  const forexMatch = query.match(forexPattern);
  if (forexMatch) {
    const formattedPair = `${forexMatch[1].toUpperCase()}/${forexMatch[2].toUpperCase()}`;
    console.log(`Padrão de forex encontrado: ${formattedPair}`);
    return { symbol: formattedPair, type: 'forex' };
  }
  
  return { symbol: '', type: null };
}

/**
 * Validates the identified asset
 */
export function validateAsset(asset: AssetIdentification): ErrorData | null {
  if (!asset.symbol || !asset.type) {
    return {
      code: ERROR_CODES.ASSET_NOT_FOUND,
      message: "Não foi possível identificar um ativo válido na sua consulta."
    };
  }
  
  if (asset.type === 'stock' && !isValidStockSymbol(asset.symbol.replace('.SA', ''))) {
    return {
      code: ERROR_CODES.INVALID_SYMBOL,
      message: `O símbolo da ação '${asset.symbol}' parece inválido.`
    };
  }
  
  if (asset.type === 'forex' && !isValidForexPair(asset.symbol)) {
    return {
      code: ERROR_CODES.INVALID_SYMBOL,
      message: `O par forex '${asset.symbol}' parece inválido.`
    };
  }
  
  return null;
}
