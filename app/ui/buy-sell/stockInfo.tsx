"use client";

import { useState, useEffect } from "react";
import StockTransactionModal from "@/app/ui/buy-sell/buySellModal";
import StockChart from "@/app/ui/buy-sell/stockChart";
import {
  buyStock,
  sellStock,
  fetchStockPriceAndChange,
  fetchBasicFinancials,
} from "@/app/lib/actions";
import Footer from "@/app/ui/footer";

export default function StockInfo({ symbol }: { symbol: string }) {
  const [stockInfo, setStockInfo] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [previousClose, setPreviousClose] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");

  useEffect(() => {
    const fetchStock = async () => {
      setIsFetching(true);

      try {
        const priceInfo = await fetchStockPriceAndChange(symbol.toUpperCase());
        const basicFinancialInfo = await fetchBasicFinancials(
          symbol.toUpperCase()
        );
        const result = {
          ...priceInfo,
          ...basicFinancialInfo,
        };
        setStockInfo(result);
      } catch (error) {
        console.log("Error getting stock price", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchStock();
  }, []);

  useEffect(() => {
    if (stockInfo) {
      setCurrentPrice(stockInfo.c);
      setPreviousClose(stockInfo.pc);
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
  };

  const priceChange = currentPrice - previousClose;
  const percentChange = (priceChange / previousClose) * 100;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold text-sky-500 mb-6">
        {symbol.toUpperCase()}
      </h2>

      {isFetching ? (
        <p className="p-2 text-gray-500">Loading...</p>
      ) : stockInfo && stockInfo.o !== 0 ? (
        <>
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

          <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg mt-4">
            <tbody>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">Previous Close</td>
                <td className="border px-4 py-2">${stockInfo.pc}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">Open</td>
                <td className="border px-4 py-2">${stockInfo.o}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">Day's Low</td>
                <td className="border px-4 py-2">${stockInfo.l}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">Day's High</td>
                <td className="border px-4 py-2">${stockInfo.h}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">52 Week Low</td>
                <td className="border px-4 py-2">${stockInfo["52WeekLow"]}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">52 Week High</td>
                <td className="border px-4 py-2">${stockInfo["52WeekHigh"]}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">
                  10 Days Avg. Volume
                </td>
                <td className="border px-4 py-2">
                  {stockInfo["10DayAverageTradingVolume"].toFixed(2)}M
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 bg-blue-100">
                  3 Months Avg. Volume
                </td>
                <td className="border px-4 py-2">
                  ${stockInfo["3MonthAverageTradingVolume"].toFixed(2)}M
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <StockChart symbol={symbol} />
          </div>
          <Footer
            sources={[
              {
                name: "Finnhub",
                link: "https://finnhub.io/docs/api/introduction",
              },
              {
                name: "yahoo-finance2",
                link: "https://www.npmjs.com/package/yahoo-finance2",
              },
            ]}
          ></Footer>
        </>
      ) : (
        <div>Stock symbol is invalid</div>
      )}

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
