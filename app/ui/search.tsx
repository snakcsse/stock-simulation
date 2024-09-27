"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { BestMatches } from "@/app/lib/definitions";
import Link from "next/link";
import { fetchBestMatches, fetchMajorMarket } from "@/app/lib/actions";

export default function Search({ placeholder }: { placeholder: string }) {
  const [searchText, setSearchText] = useState("");
  const [bestMatches, setbestMatches] = useState<BestMatches[]>([]);
  const [marketData, setMarketData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  // Update searchText based on user's input
  const updateSearchText = useDebouncedCallback(
    (value) => setSearchText(value),
    1500
  );

  // Solve here -> somehow clicking this goes to /assets
  const handleSearchClick = () => {
    router.push(`/my-page/buy-sell/${searchText.toLocaleUpperCase()}`); //
  };

  // Fetch searchBestMatches to get bestMatches
  useEffect(() => {
    const handleSearch = async () => {
      setIsFetching(true);
      if (!searchText) return;

      try {
        const bestMatches = await fetchBestMatches(searchText);
        setbestMatches(bestMatches);
      } catch (error) {
        console.error("Error fetching best matches", error);
      } finally {
        setIsFetching(false);
      }
    };
    handleSearch();
  }, [searchText]);

  // useEffect(() => {
  //   const fetchMarketData = async () => {
  //     try {
  //       const result = await fetchMajorMarket();
  //       setMarketData(result);
  //     } catch (error) {
  //       console.error("Error fetching market data", error);
  //     }
  //   };
  //   fetchMarketData();
  // }, []);

  return (
    <div className="space-y-8 relative">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-sky-500">Trade</h1>
      {/* Search Section */}
      <div className="relative z-10">
        <div className="flex items-center relative">
          <MagnifyingGlassIcon className="absolute left-3 h-5 text-gray-500" />
          <input
            className="peer w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder={placeholder}
            onChange={(e) => updateSearchText(e.target.value)}
          />
          <button
            type="button"
            onClick={handleSearchClick}
            className="ml-2 rounded-md bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
          >
            Search
          </button>
        </div>

        {/* Dropdown-style search results */}
        {/* {inputFocused && searchText && ( */}
        {searchText && (
          <div
            // onClick={setInputFocused(true)}
            className="absolute top-12 left-0 w-full mt-2 bg-white shadow-lg border border-gray-200 rounded-md max-h-48 overflow-y-auto text-sm z-20"
          >
            {isFetching ? (
              <p className="p-2 text-gray-500">Loading...</p>
            ) : bestMatches.length > 0 ? (
              bestMatches.map((stock) => (
                <Link
                  key={stock["1. symbol"]}
                  href={`/my-page/buy-sell/${stock["1. symbol"]}`}
                  className="block p-2 hover:bg-sky-500 hover:text-white"
                  onClick={() =>
                    router.push(`/my-page/buy-sell/${stock["1. symbol"]}`)
                  } // Keep the input focused until the link is clicked
                >
                  <strong>{stock["1. symbol"]}</strong> -{" "}
                  {`${stock["2. name"]} (${stock["4. region"]})`}
                </Link>
              ))
            ) : (
              <p className="p-2 text-gray-500">
                No matching stocks or search quote exceeded daily limit. Please
                type in stock symbol and search.
              </p>
            )}
          </div>
        )}
      </div>
      {/* Market Data Section */}
      {/* <Suspense fallback={<p>Loading...</p>}>
        <div className="relative z-0">
          <h2 className="text-xl font-semibold text-gray-700">Market Data</h2>
          {marketData.length > 0 ? (
            <div className="mt-4 flex flex-row space-x-8">
              {marketData.map((data) => (
                <div
                  key={data.symbol}
                  className="p-4 bg-gray-50 shadow rounded-md w-72 h-40 flex flex-col justify-between"
                >
                  <div className="text-left text-lg font-semibold text-sky-500">
                    {data.name}
                  </div>

                  <div className="text-left text-xl font-medium">
                    {data.currentPrice.toFixed(2)}
                  </div>

                  <div
                    className={`text-left text-sm ${
                      data.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {data.change >= 0 ? "+" : ""}
                    {data.change.toFixed(2)} ({data.changePercent.toFixed(3)}%)
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-gray-400">
              Currently market data is unavailable
            </p>
          )}
        </div>
      </Suspense> */}
    </div>
  );
}
