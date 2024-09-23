import { fetchAssets, fetchStockInfo, fetchUserCash } from "@/app/lib/actions";

export default async function Assets() {
  const assets = await fetchAssets();
  const userCash = await fetchUserCash();

  if (!assets || assets.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  for (let asset of assets) {
    const stockInfo = await fetchStockInfo(asset.stock_symbol);
    const current_price = stockInfo.price.regularMarketPrice;
    asset.current_price = current_price;
    asset.growth = (current_price - asset.average_price) * asset.quantity;
  }

  return (
    <div>
      <div>Cash - ${userCash}</div>
      {assets.map((asset, index) => {
        return (
          <div key={index}>
            {asset.stock_symbol} - {asset.quantity} - {asset.average_price} -{" "}
            {asset.current_price} - {asset.growth}
          </div>
        );
      })}
    </div>
  );
}
