// import axios from "axios";

// const api_key = process.env.ALPHA_API_KEY;

// // maybe need to use encode URL for keywords
// export async function searchBestMatchesStocks(keywords: string) {
//   const alpha_api = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${api_key}`;
//   // const alpha_api = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=microsoft&apikey=${api_key}`;

//   try {
//     const response = await axios.get(alpha_api);
//     const bestMatches = await response.data["bestMatches"];
//     console.log(bestMatches);
//     return bestMatches;
//   } catch (error) {
//     console.error("Failed to fetch stock:", error);
//     throw new Error("Failed to fetch stock.");
//   }
// }
