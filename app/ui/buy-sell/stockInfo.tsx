"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { StockInfo } from "@/app/lib/definitions";
import StockTransactionModal from "@/app/ui/buy-sell/buySellModal";
import { buyStock, sellStock } from "@/app/lib/actions";

export default function StockInfo({ symbol }: { symbol: string }) {
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");

  // const { data: session, status } = useSession();
  // if (status === "loading") {
  //   return <p>Loading...</p>;
  // }

  // if (!session) {
  //   return <p>Access Denied</p>;
  // }

  // console.log(session);

  // const userId = session?.user?.id;

  // getUser();

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
        stockInfo={stockInfo}
        // price={stockInfo ? stockInfo.price.regularMarketPrice : null}
      />
    </div>
  );
}
