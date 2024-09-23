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

type SummaryDetail = {
  marketCap: number;
  volume: number;
  averageVolume: number;
  previousClose: number;
  open: number;
  daysRange: string;
  week52Range: string;
  [key: string]: any;
};

type StockPrice = {
  regularMarketPrice: number;
  [key: string]: any;
};

export type StockInfo = {
  summaryDetail: SummaryDetail;
  price: StockPrice;
};

export type StockTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    quantity: number;
    password: string;
    transactionType: string;
    price: number | null;
  }) => void;
  transactionType: "buy" | "sell";
};
