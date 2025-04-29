
// Mock financial analysis response function (this would be replaced with actual API calls)
export const generateFinancialAnalysis = async (query: string): Promise<string> => {
  // This is a placeholder. In a real implementation, this would call the financial APIs and OpenAI
  const assetMatch = query.match(/\b([A-Z]{1,5}(?:\/[A-Z]{3})?)\b/i);
  
  if (!assetMatch) {
    return "Não pude identificar um código válido de ação ou par de moedas na sua consulta. Por favor, especifique uma ação (ex: AAPL) ou um par de moedas (ex: EUR/USD).";
  }
  
  const asset = assetMatch[1].toUpperCase();
  
  // Check if it's a forex pair
  if (asset.includes('/')) {
    const [baseCurrency, quoteCurrency] = asset.split('/');
    
    // Sample forex analysis response in Portuguese
    return `${baseCurrency}/${quoteCurrency} - Análise Fundamental:\n\nIndicadores Macroeconômicos Principais:\n• Taxa de Juros ${baseCurrency}: 4,75%\n• Taxa de Juros ${quoteCurrency}: 5,50%\n• Taxa de Inflação ${baseCurrency}: 3,2%\n• Taxa de Inflação ${quoteCurrency}: 3,7%\n• Crescimento do PIB ${baseCurrency}: 0,3% (Trimestre a Trimestre)\n• Crescimento do PIB ${quoteCurrency}: 0,5% (Trimestre a Trimestre)\n\nPerspectiva do Banco Central:\n• Banco Central do ${baseCurrency}: Atualmente em padrão de espera após uma série de aumentos nas taxas. Orientações futuras sugerem possíveis cortes nas taxas nos próximos 6 meses.\n• Banco Central do ${quoteCurrency}: Ainda mantém uma postura restritiva com mais um potencial aumento de taxa esperado antes do final do ano.\n\nRiscos Políticos e Econômicos:\n• ${baseCurrency}: Estabilidade política moderada, preocupações com preços de energia\n• ${quoteCurrency}: Mercado de trabalho forte, mas fraqueza no setor imobiliário\n\nBalança Comercial:\n• Balança Comercial ${baseCurrency}: -€15,2B\n• Balança Comercial ${quoteCurrency}: -$78,8B\n\nResumo e Perspectiva:\nCom base na análise fundamental, a perspectiva é ligeiramente negativa para ${baseCurrency} contra ${quoteCurrency} no curto prazo devido à diferença nas taxas de juros e ao crescimento mais forte na economia do ${quoteCurrency}. No entanto, a perspectiva de médio prazo sugere uma possível reversão, já que o banco central do ${baseCurrency} provavelmente terminará seu ciclo de flexibilização antes do banco central do ${quoteCurrency}.`;
  } 
  else {
    // Sample stock analysis response in Portuguese
    return `${asset} - Análise Fundamental:\n\nVisão Geral da Empresa:\n${asset} é uma importante empresa de tecnologia especializada em eletrônicos de consumo, software e serviços online.\n\nMétricas Financeiras Chave:\n• Valor de Mercado: R$13,9 trilhões\n• Índice P/L: 28,3\n• Índice P/VPA: 34,6\n• ROE: 175%\n• ROA: 28,3%\n• Dívida/Patrimônio: 1,65\n• Índice de Liquidez Corrente: 1,07\n\nDesempenho Recente:\n• Receita (Último Trimestre): R$447,5 bilhões (-1,2% YoY)\n• Lucro Líquido: R$120,5 bilhões (+2,3% YoY)\n• Margens de Lucro:\n  - Bruta: 43,5%\n  - Operacional: 30,2%\n  - Líquida: 25,9%\n\nDesempenho Histórico:\n• Retorno 1 Ano: +18,5%\n• Retorno 5 Anos: +252,3%\n\nNegociações Recentes de Insiders:\nLeve venda líquida nos últimos 3 meses, com executivos exercendo opções.\n\nNotícias Recentes:\nLançou nova linha de produtos com recursos de IA. Parceria com grandes provedores de nuvem anunciada.\n\nAnálise de Risco:\n• Dólar forte pode afetar receitas internacionais\n• Restrições na cadeia de suprimentos persistem, mas estão melhorando\n• Aumento da concorrência em categorias-chave de produtos\n• Escrutínio regulatório em múltiplos mercados\n\nResumo:\nCom base na análise fundamental, ${asset} está atualmente com preço justo, negociando ligeiramente acima da média do setor em termos de P/L, mas justificável dado o forte fluxo de caixa, posição de mercado e crescimento em serviços. A empresa mantém margens líderes do setor, embora enfrente ventos contrários de condições macroeconômicas e restrições de suprimentos.`;
  }
};
