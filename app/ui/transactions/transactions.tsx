import { fetchTransactions } from "@/app/lib/actions";

export default async function Transaction() {
  const transactions = await fetchTransactions();
  console.log(transactions);

  if (!transactions || transactions.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div>
      {transactions.map((transaction) => {
        const transactionTime = new Date(
          transaction.transaction_time
        ).toLocaleString();

        return (
          <div key={transaction.id}>
            {transactionTime} - {transaction.symbol} - {transaction.quantity} -{" "}
            {transaction.type} - {transaction.price_at_transaction}
          </div>
        );
      })}
    </div>
  );
}
