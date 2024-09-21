// import {searchBestMatchesStocks} from '@/app/lib/data'
import axios from "axios";
import type { NextRequest } from "next/server";

const api_key = process.env.ALPHA_API_KEY;
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!query) {
    return new Response(null, { status: 204 });
  }

  const alpha_api = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${api_key}`;
  try {
    const res = await axios.get(alpha_api);
    const bestMatches = await res.data["bestMatches"];
    return Response.json({ status: 200, data: bestMatches });
  } catch (error) {
    return Response.json({ status: 400, error: "Error fetching data" });
  }
}
