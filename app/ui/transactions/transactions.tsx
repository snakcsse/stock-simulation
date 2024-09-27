import { fetchTransactions } from "@/app/lib/actions";

export default async function Transaction() {
  const transactions = await fetchTransactions();

  if (!transactions || transactions.length === 0) {
    return <p className="mt-4 text-gray-400">No transactions available.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <h1 className="text-3xl font-semibold text-sky-500">Transactions</h1>

      {/* Transactions Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-96">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="text-left text-gray-600 font-semibold">
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Stock Symbol</th>
              <th className="px-4 py-2 border-b">Quantity</th>
              <th className="px-4 py-2 border-b">Transaction Type</th>
              <th className="px-4 py-2 border-b">Price at Transaction</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const transactionTime = new Date(
                transaction.transaction_time
              ).toLocaleString();

              return (
                <tr key={transaction.id} className="border-t">
                  <td className="px-4 py-2">{transactionTime}</td>
                  <td className="px-4 py-2">{transaction.stock_symbol}</td>
                  <td className="px-4 py-2">{transaction.quantity}</td>
                  <td className="px-4 py-2">{transaction.transaction_type}</td>
                  <td className="px-4 py-2">
                    ${transaction.price_at_transaction}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
