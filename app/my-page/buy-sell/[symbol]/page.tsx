import StockInfo from "@/app/ui/buy-sell/stockInfo";

export default async function Page({
  params,
}: {
  params: {
    symbol: string;
  };
}) {
  const symbol = params.symbol;

  return (
    <>
      <div>
        <StockInfo symbol={symbol} />
      </div>
    </>
  );
}
