"use-client";

import { useState } from "react";
import { StockTransactionModalProps } from "@/app/lib/definitions";

export default function StockTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  transactionType,
  stockInfo,
}: StockTransactionModalProps) {
  const [quantity, setQuantity] = useState(100);
  const [password, setPassword] = useState("");
  const [quantityCheck, setQuantityCheck] = useState("");

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value % 100 === 0 && value >= 100) {
      setQuantity(value);
      setQuantityCheck("");
    } else {
      setQuantityCheck(
        "Quantity must be in increments of 100 and at least 100"
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (quantityCheck) return;

    const price = stockInfo ? stockInfo.c : 0;

    try {
      await onSubmit(quantity, password, transactionType, price);

      alert(
        `Successfully ${
          transactionType === "buy" ? "bought" : "sold"
        } ${quantity} units at $${price}`
      );
      setPassword("");
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred");
      }
      setPassword("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 w-screen h-screen">
      <div className="relative bg-white rounded-lg p-6 w-full max-w-lg mx-4 sm:w-1/3 sm:p-8">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">
          {transactionType === "buy" ? "Buy Stock" : "Sell Stock"}
        </h2>
        <button
          className="absolute top-2 right-2 text-gray-500 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm sm:text-base">
              Quantity (100 unit increments)
            </label>
            <input
              type="number"
              defaultValue={100}
              onChange={handleQuantityChange}
              className="border border-gray-300 p-2 w-full rounded text-sm sm:text-base"
              // min="100"
              // step="100"
            />
            {quantityCheck && (
              <p className="text-red-500 text-xs sm:text-sm">{quantityCheck}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm sm:text-base">
              Account Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full text-sm sm:text-base"
          >
            {transactionType === "buy" ? "Buy" : "Sell"}
          </button>
        </form>
      </div>
    </div>
  );
}
