import Row from "../../../types/Row";

// Define known companies by sector
const COMPANIES_BY_SECTOR = {
  Technology: [
    { ticker: "AAPL", name: "Apple Inc.", price: 182.52, marketCap: 2852.4 },
    { ticker: "MSFT", name: "Microsoft Corporation", price: 338.14, marketCap: 2512.9 },
    { ticker: "GOOGL", name: "Alphabet Inc.", price: 142.65, marketCap: 1789.3 },
    { ticker: "AMZN", name: "Amazon.com Inc.", price: 175.35, marketCap: 1811.2 },
    { ticker: "META", name: "Meta Platforms Inc.", price: 478.22, marketCap: 1214.6 },
    { ticker: "TSLA", name: "Tesla Inc.", price: 177.58, marketCap: 567.2 },
    { ticker: "NVDA", name: "NVIDIA Corporation", price: 110.55, marketCap: 2724.1 },
    { ticker: "NFLX", name: "Netflix Inc.", price: 628.55, marketCap: 272.3 },
  ],
  Healthcare: [
    { ticker: "JNJ", name: "Johnson & Johnson", price: 147.52, marketCap: 355.3 },
    { ticker: "PFE", name: "Pfizer Inc.", price: 26.95, marketCap: 152.9 },
    { ticker: "UNH", name: "UnitedHealth Group Inc.", price: 527.24, marketCap: 487.5 },
    { ticker: "MRK", name: "Merck & Co Inc.", price: 105.11, marketCap: 265.8 },
    { ticker: "ABT", name: "Abbott Laboratories", price: 107.57, marketCap: 187.1 },
  ],
  Financial: [
    { ticker: "JPM", name: "JPMorgan Chase & Co.", price: 182.06, marketCap: 522.7 },
    { ticker: "BAC", name: "Bank of America Corp.", price: 38.34, marketCap: 301.2 },
    { ticker: "WFC", name: "Wells Fargo & Co.", price: 56.94, marketCap: 204.1 },
    { ticker: "V", name: "Visa Inc.", price: 275.96, marketCap: 583.2 },
    { ticker: "MA", name: "Mastercard Inc.", price: 445.58, marketCap: 416.8 },
  ],
  Consumer: [
    { ticker: "PG", name: "Procter & Gamble Co.", price: 169.85, marketCap: 400.2 },
    { ticker: "KO", name: "Coca-Cola Co.", price: 62.17, marketCap: 268.6 },
    { ticker: "PEP", name: "PepsiCo Inc.", price: 169.55, marketCap: 233.2 },
    { ticker: "WMT", name: "Walmart Inc.", price: 59.68, marketCap: 481.4 },
    { ticker: "MCD", name: "McDonald's Corp.", price: 257.75, marketCap: 186.9 },
  ],
  Energy: [
    { ticker: "XOM", name: "Exxon Mobil Corp.", price: 113.9, marketCap: 453.2 },
    { ticker: "CVX", name: "Chevron Corp.", price: 145.29, marketCap: 271.4 },
    { ticker: "COP", name: "ConocoPhillips", price: 108.14, marketCap: 126.5 },
    { ticker: "SLB", name: "Schlumberger NV", price: 43.44, marketCap: 62.1 },
  ],
  Industrial: [
    { ticker: "GE", name: "General Electric Co.", price: 159.91, marketCap: 174.5 },
    { ticker: "BA", name: "Boeing Co.", price: 181.5, marketCap: 110.9 },
    { ticker: "HON", name: "Honeywell International Inc.", price: 201.58, marketCap: 131.7 },
    { ticker: "CAT", name: "Caterpillar Inc.", price: 345.54, marketCap: 168.9 },
    { ticker: "UPS", name: "United Parcel Service Inc.", price: 134.85, marketCap: 115.3 },
  ],
  Telecom: [
    { ticker: "VZ", name: "Verizon Communications Inc.", price: 40.81, marketCap: 171.9 },
    { ticker: "T", name: "AT&T Inc.", price: 17.16, marketCap: 123.0 },
    { ticker: "CMCSA", name: "Comcast Corp.", price: 40.01, marketCap: 158.1 },
  ],
};

// Generate realistic finance data with known companies
export const generateFinanceData = (): Row[] => {
  const sectors = Object.keys(COMPANIES_BY_SECTOR);
  let rowId = 0;

  return sectors.map((sector) => {
    const companies = COMPANIES_BY_SECTOR[sector as keyof typeof COMPANIES_BY_SECTOR];

    const children = companies.map((company) => {
      // Use realistic company data as a base
      const price = company.price * (0.9 + Math.random() * 0.2); // +/- 10% from base price
      const marketCap = company.marketCap;
      const peRatio = parseFloat((Math.random() * 40 + 5).toFixed(1));
      const dividendYield = parseFloat((Math.random() * 5).toFixed(2));
      const revenueGrowth = parseFloat((Math.random() * 40 - 10).toFixed(1));
      const profitMargin = parseFloat((Math.random() * 30).toFixed(1));
      const riskFactor = Math.floor(Math.random() * 10) + 1;
      const esgScore = Math.floor(Math.random() * 80) + 20;
      const analystRating = parseFloat((Math.random() * 3 + 2).toFixed(1)); // 2.0-5.0 range for ratings

      // Calculate a price change with more realistic distribution
      let priceChangePercent;
      const rand = Math.random();
      if (rand < 0.05) {
        // Rare big drops
        priceChangePercent = parseFloat((Math.random() * -15 - 5).toFixed(2));
      } else if (rand < 0.3) {
        // Common small drops
        priceChangePercent = parseFloat((Math.random() * -5).toFixed(2));
      } else if (rand < 0.7) {
        // Common small gains
        priceChangePercent = parseFloat((Math.random() * 5).toFixed(2));
      } else if (rand < 0.95) {
        // Common large gains
        priceChangePercent = parseFloat((Math.random() * 10).toFixed(2));
      } else {
        // Rare big gains
        priceChangePercent = parseFloat((Math.random() * 15 + 10).toFixed(2));
      }

      return {
        rowMeta: { rowId: rowId++, isExpanded: true },
        rowData: {
          sectorName: sector,
          ticker: company.ticker,
          companyName: company.name,
          price,
          priceChangePercent,
          marketCap,
          peRatio,
          dividendYield,
          revenueGrowth,
          profitMargin,
          riskFactor,
          esgScore,
          analystRating,
        },
      };
    });

    // Calculate sector totals and averages
    const avgPriceChange = parseFloat(
      (
        children.reduce((sum, child) => sum + (child.rowData.priceChangePercent as number), 0) / children.length
      ).toFixed(2)
    );
    const avgPERatio = parseFloat(
      (children.reduce((sum, child) => sum + (child.rowData.peRatio as number), 0) / children.length).toFixed(1)
    );
    const avgDividendYield = parseFloat(
      (children.reduce((sum, child) => sum + (child.rowData.dividendYield as number), 0) / children.length).toFixed(2)
    );
    const totalMarketCap = parseFloat(
      children.reduce((sum, child) => sum + (child.rowData.marketCap as number), 0).toFixed(1)
    );
    const avgESGScore = Math.round(
      children.reduce((sum, child) => sum + (child.rowData.esgScore as number), 0) / children.length
    );

    return {
      rowMeta: { rowId: rowId++, isExpanded: true, children },
      rowData: {
        sectorName: sector,
        ticker: "—",
        companyName: `${sector} Sector (${children.length})`,
        price: "—",
        priceChangePercent: avgPriceChange,
        marketCap: totalMarketCap,
        peRatio: avgPERatio,
        dividendYield: avgDividendYield,
        revenueGrowth: "—",
        profitMargin: "—",
        riskFactor: "—",
        esgScore: avgESGScore,
        analystRating: "—",
      },
    };
  });
};
