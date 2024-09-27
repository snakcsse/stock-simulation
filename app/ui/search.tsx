"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { BestMatches } from "@/app/lib/definitions";
import Link from "next/link";
import { fetchBestMatches } from "@/app/lib/actions";

export default function Search({ placeholder }: { placeholder: string }) {
  const [searchText, setSearchText] = useState("");
  const [bestMatches, setbestMatches] = useState<BestMatches[]>([]);
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
        {searchText && (
          <div className="absolute top-12 left-0 w-full mt-2 bg-white shadow-lg border border-gray-200 rounded-md max-h-48 overflow-y-auto text-sm z-20">
            {isFetching ? (
              <p className="p-2 text-gray-500">Loading...</p>
            ) : bestMatches.length > 0 ? (
              bestMatches.map((stock) => (
                <Link
                  key={stock["1. symbol"]}
                  href={`/my-page/buy-sell/${stock["1. symbol"]}`}
                  className="block p-2 hover:bg-sky-500 hover:text-white"
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
    </div>
  );
}
