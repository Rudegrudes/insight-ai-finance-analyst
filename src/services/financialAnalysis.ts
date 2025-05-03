
// Main export file - entry point for the financial analysis service
import { generateFinancialAnalysis as generateAnalysis } from './financial/analysisService';

/**
 * Public API for generating financial analysis based on user queries
 * 
 * @param query User's text query about a financial instrument
 * @returns Formatted analysis text
 */
export const generateFinancialAnalysis = generateAnalysis;
