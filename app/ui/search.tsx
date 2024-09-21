"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { BestMatches } from "@/app/lib/definitions";
import Link from "next/link";

export default function Search({ placeholder }: { placeholder: string }) {
  // const searchParams = useSearchParams();
  // const pathname = usePathname();
  // const { replace } = useRouter();

  // const handleSearch = useDebouncedCallback((term: string) => {
  //   const params = new URLSearchParams(searchParams); // provides utility methods for working with the query string of a URL (searchParams)

  //   if (term) {
  //     params.set("keywords", term);
  //   } else {
  //     params.delete("keywords");
  //   }
  //   replace(`${pathname}?${params.toString()}`);
  // }, 1000);

  const [searchText, setSearchText] = useState("");
  const [bestMatches, setbestMatches] = useState<BestMatches[]>([]);
  const [inputFocused, setInputFocused] = useState(false);
  const router = useRouter();
  // const [error, setError] = useState(null);

  // Update searchText based on user's input
  const updateSearchText = useDebouncedCallback(
    (value) => setSearchText(value),
    500
  );

  const handleSearchClick = () => {
    router.push(`/buy-sell/${searchText.toLocaleUpperCase()}`); //
  };

  // Fetch searchBestMatches api to get bestMatches
  useEffect(() => {
    const handleSearch = async () => {
      if (!searchText) return;

      try {
        const res = await axios.get(
          `/api/searchBestMatches?query=${searchText}`
        );
        setbestMatches(res.data.data);
      } catch (error) {
        console.error("Error fetching best matches", error);
      }
    };
    handleSearch();
  }, [searchText]);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <div className="flex">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={(e) => updateSearchText(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          // defaultValue={searchParams.get("keywords")?.toString()}
        />
        <button type="button" onClick={handleSearchClick} className="h-10 w-10">
          Search
        </button>
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
      </div>
      {Array.isArray(bestMatches) && bestMatches.length > 0 ? (
        <div className="w-full flex flex-col">
          {bestMatches.map((stock) => (
            <Link
              key={stock["1. symbol"]}
              href={`/buy-sell/${stock["1. symbol"]}`}
              className="hover:bg-blue-500 cursor-pointer"
            >
              <strong>{stock["1. symbol"]}</strong> -{" "}
              {`${stock["2. name"]} ${stock["4. region"]}`}
            </Link>
          ))}
        </div>
      ) : (
        inputFocused && (
          <div>
            <p>No matching stocks or search exceeded daily limit</p>
          </div>
        )
      )}
    </div>
  );
}
