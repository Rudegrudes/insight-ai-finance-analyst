
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
};

export type ForexData = {
  rate: number;
  simulated?: boolean;
};

export type AssetIdentification = {
  symbol: string;
  type: 'stock' | 'forex' | null;
};
