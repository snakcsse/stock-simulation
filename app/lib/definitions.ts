export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type BestMatches = {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "8. currency": string;
  [key: string]: any;
};

export type FinnhubQuote = {
  c: number;
  h: number;
  l: number;
  o: number;
  pc: number;
  t: number;
};

export type FinnhubFinancialBasics = {
  metric: FinancialBasicsMetric;
  [key: string]: any;
};

export type FinnhubStockInfo = FinnhubQuote & FinancialBasicsMetric;

type FinancialBasicsMetric = {
  "10DayAverageTradingVolume"?: number;
  "52WeekHigh"?: number;
  "52WeekLow"?: number;
  "52WeekPriceReturnDaily"?: number;
  [key: string]: any;
};

export type StockTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    quantity: number,
    password: string,
    transactionType: "buy" | "sell",
    price: number
  ) => Promise<void>;
  transactionType: "buy" | "sell";
  stockInfo: FinnhubQuote | null;
};

export type ChartData = {
  labels: string[];
  datasets: [
    {
      label: string;
      data: (number | null)[];
      [key: string]: any;
    }
  ];
};

export type FooterSources = { name: string; link: string }[];
