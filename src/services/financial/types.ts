
// Define types used across the financial services

export type StockData = {
  symbol: string;
  companyName: string;
  price: number;
  changes: number;
  changesPercentage: string | number;
  mktCap: number;
  sector?: string;
  country?: string;
  pe?: string | number;
  dividendYield?: string | number;
};

export type StockQuote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: string | number;
};

export type NewsItem = {
  headline: string;
  datetime: number;
  source: string;
  url?: string;
  summary?: string;
};

export type ForexData = {
  rate: number;
  simulated?: boolean;
  timestamp?: number;
};

export type AssetIdentification = {
  symbol: string;
  type: 'stock' | 'forex' | null;
};

export type AnalysisResult = {
  text: string;
  type: 'stock' | 'forex' | 'error';
  data?: StockData | ForexData;
  error?: ErrorData;
};

export type ErrorData = {
  code: string;
  message: string;
  source?: string;
};

// API response types
export type FinnhubForexResponse = {
  base: string;
  quote: Record<string, number>;
};

export type FinancialModelPrepProfileResponse = Array<{
  symbol: string;
  companyName: string;
  price: number;
  mktCap: number;
  changes: number;
  changesPercentage: string | number;
  sector?: string;
  country?: string;
  pe?: string | number;
  dividendYield?: string | number;
}>;

export type FinancialModelPrepQuoteResponse = Array<{
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: string | number;
}>;
