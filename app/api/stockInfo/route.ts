import axios from "axios";
import type { NextRequest } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get("symbol");

  if (!symbol) {
    return new Response(null, { status: 204 });
  }

  try {
    const queryOptions = {
      modules: ["price", "summaryDetail"],
    };
    const data = await yahooFinance.quoteSummary(symbol, queryOptions);
    return Response.json({ status: 200, data });
  } catch (error) {
    return Response.json({ status: 400, error: "Error fetching data" });
  }
}
