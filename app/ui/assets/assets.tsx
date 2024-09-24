import { fetchAssets, fetchStockInfo, fetchUserCash } from "@/app/lib/actions";

export default async function Assets() {
  const assets = await fetchAssets();
  const cashBalance = await fetchUserCash();
  const userCash = parseFloat(cashBalance);

  return (
    <div className="p-6 mt-6 md:mt-0 bg-white rounded-lg shadow-lg">
      {/* Assets Title */}
      <h1 className="text-2xl font-semibold text-gray-700 mb-4">Assets</h1>

      {/* Cash Balance Section */}
      <div className="bg-sky-100 p-4 rounded-md mb-6">
        <h2 className="text-lg font-medium text-gray-600">Cash Balance</h2>
        <p className="text-xl font-semibold text-gray-900">
          ${userCash.toFixed(2)}
        </p>
      </div>

      {/* Stocks Table */}
      {assets && assets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-sky-300 text-white">
                <th className="p-4 text-left">Stock Symbol</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Average Price</th>
                <th className="p-4 text-left">Current Price</th>
                <th className="p-4 text-left">Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {await Promise.all(
                assets.map(async (asset, index) => {
                  const stockInfo = await fetchStockInfo(asset.stock_symbol);
                  const current_price = stockInfo.price.regularMarketPrice;
                  const growth =
                    (current_price - asset.average_price) * asset.quantity;
                  return (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-4 text-gray-700">
                        {asset.stock_symbol}
                      </td>
                      <td className="p-4 text-gray-700">{asset.quantity}</td>
                      <td className="p-4 text-gray-700">
                        ${parseFloat(asset.average_price).toFixed(2)}
                      </td>
                      <td className="p-4 text-gray-700">${current_price}</td>
                      <td
                        className={`p-4 font-medium ${
                          growth >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        ${growth.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">You currently own no stocks.</p>
      )}
    </div>
  );
}
