"use client";

import { useState, useEffect } from "react";
import { StockInfo } from "@/app/lib/definitions";
import StockTransactionModal from "@/app/ui/buy-sell/buySellModal";
import StockChart from "@/app/ui/buy-sell/stockChart";
import { buyStock, sellStock, fetchStockInfo } from "@/app/lib/actions";

export default function StockInfo({ symbol }: { symbol: string }) {
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [previousClose, setPreviousClose] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const result = await fetchStockInfo(symbol);
        setStockInfo(result);
      } catch (error) {
        console.log("Error getting stock price", error);
      }
    };
    fetchStock();
  }, []);

  useEffect(() => {
    if (stockInfo) {
      setCurrentPrice(stockInfo.price.regularMarketPrice);
      setPreviousClose(stockInfo.summaryDetail.previousClose);
    }
  });

  const handleBuyClick = () => {
    setTransactionType("buy");
    setIsModalOpen(true);
  };

  const handleSellClick = () => {
    setTransactionType("sell");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitTransaction = async (
    quantity: number,
    price: number,
    password: string,
    transactionType: "buy" | "sell"
  ) => {
    if (transactionType === "buy") {
      await buyStock(symbol, quantity, price, password, transactionType);
    } else if (transactionType === "sell") {
      await sellStock(symbol, quantity, price, password, transactionType);
    }
    console.log(`Submitted transaction for ${symbol} as ${transactionType}`);
    // setIsModalOpen(false);
  };

  const priceChange = currentPrice - previousClose;
  const percentChange = (priceChange / previousClose) * 100;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-sky-500 mb-6">
        {symbol.toUpperCase()}
      </h2>

      {stockInfo ? (
        <>
          {/* Display Current Price and Change */}
          <div className="flex items-center mb-4">
            <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
            <div
              className={`ml-4 ${
                priceChange >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
            </div>
          </div>

          {/* Buttons for Buy/Sell */}
          <div className="mt-4 flex justify-start space-x-4">
            <button
              onClick={handleBuyClick}
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Buy
            </button>
            <button
              onClick={handleSellClick}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Sell
            </button>
          </div>

          {/* Stock Data Table */}
          <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg mt-4">
            <tbody>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">Previous Close</td>
                <td className="border px-4 py-2">
                  ${stockInfo.summaryDetail.previousClose}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">Open</td>
                <td className="border px-4 py-2">
                  ${stockInfo.summaryDetail.open}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">Day's Low</td>
                <td className="border px-4 py-2">
                  ${stockInfo.summaryDetail.dayLow}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">Day's High</td>
                <td className="border px-4 py-2">
                  ${stockInfo.summaryDetail.dayHigh}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">52 Week Low</td>
                <td className="border px-4 py-2">
                  ${stockInfo.summaryDetail.fiftyTwoWeekLow}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">52 Week High</td>
                <td className="border px-4 py-2">
                  ${stockInfo.summaryDetail.fiftyTwoWeekHigh}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">Volume</td>
                <td className="border px-4 py-2">
                  {(stockInfo.summaryDetail.volume / 1000000).toFixed(2)}M
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">Market Cap</td>
                <td className="border px-4 py-2">
                  ${(stockInfo.summaryDetail.marketCap / 100000000).toFixed(2)}B
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <div>Loading...</div>
      )}

      <div>
        <StockChart symbol={symbol} />
      </div>

      <StockTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTransaction}
        transactionType={transactionType}
        stockInfo={stockInfo}
      />
    </div>
  );
}
