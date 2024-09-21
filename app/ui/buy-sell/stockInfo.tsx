"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { StockInfo } from "@/app/lib/definitions";
import StockTransactionModal from "@/app/ui/buy-sell/buySellModal";

export default function StockInfo({ symbol }: { symbol: string }) {
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(`/api/stockInfo?symbol=${symbol}`);
        const data = res.data.data;
        setStockInfo(data);
      } catch (error) {
        console.log("Error getting stock price", error);
      }
    };
    fetchStock();
  }, []);
  //   const res = await axios.get(`/api/stockInfo?symbol=${symbol}`);

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

  const handleSubmitTransaction = () => {
    // TODO: Implement transaction logic here
    console.log(`Submitting transaction for ${symbol} as ${transactionType}`);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>{symbol}</h2>
      {stockInfo ? (
        <>
          <p>{stockInfo.price.regularMarketPrice}</p>
          <ul>
            <li>
              <strong>Previous Close:</strong>{" "}
              {stockInfo.summaryDetail.previousClose}
            </li>
            <li>
              <strong>Open:</strong> {stockInfo.summaryDetail.open}
            </li>
            <li>
              <strong>Day's Low:</strong> {stockInfo.summaryDetail.dayLow}
            </li>
            <li>
              <strong>Day's High:</strong> {stockInfo.summaryDetail.dayHigh}
            </li>
            <li>
              <strong>52 Weeks Low:</strong>{" "}
              {stockInfo.summaryDetail.fiftyTwoWeekLow}
            </li>
            <li>
              <strong>52 Weeks High:</strong>{" "}
              {stockInfo.summaryDetail.fiftyTwoWeekHigh}
            </li>
            <li>
              <strong>Volume:</strong> {stockInfo.summaryDetail.volume}
            </li>
            <li>
              <strong>Market Cap:</strong> {stockInfo.summaryDetail.marketCap}
            </li>
          </ul>
          <button className="p-4 border" onClick={handleBuyClick}>
            Buy
          </button>
          <button className="p-4 border" onClick={handleSellClick}>
            Sell
          </button>
        </>
      ) : (
        <div>Loading...</div>
      )}
      <StockTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTransaction}
        transactionType={transactionType}
      />
    </div>
  );
}
