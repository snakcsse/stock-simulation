"use-client";

import { useState, useEffect } from "react";
import { StockTransactionModalProps } from "@/app/lib/definitions";

// TODO: Understand types
export default function StockTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  transactionType,
}: StockTransactionModalProps) {
  const [quantity, setQuantity] = useState(100);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);
    if (value % 100 === 0 && value >= 100) {
      setQuantity(value);
      setError("");
    } else {
      setError("Quantity must be in increments of 100 and at least 100");
    }
  };

  // TODO: understand type
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) return;

    onSubmit({ quantity, password, transactionType });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <h2 className="text-lg font-bold mb-4">
          {transactionType === "buy" ? "Buy Stock" : "Sell Stock"}
        </h2>
        <button
          className="absolute top-2 right-2 text-gray-500 bg-blue-500"
          onClick={onClose}
        >
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Quantity (100 unit increments)</label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="border border-gray-300 p-2 w-full rounded"
              min="100"
              step="100"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="mb-4">
            <label className="block mb-1">Transaction Password</label>
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
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            {transactionType === "buy" ? "Buy" : "Sell"}
          </button>
        </form>
      </div>
    </div>
  );
}
