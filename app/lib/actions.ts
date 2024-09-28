"use server";
import { auth } from "@/auth";

import { signIn } from "@/auth";
import axios from "axios";
import { AuthError } from "next-auth";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import yahooFinance from "yahoo-finance2";
import bcrypt from "bcrypt";
import {
  FinnhubQuote,
  FinnhubFinancialBasics,
  BestMatches,
} from "@/app/lib/definitions";

// Setting up finnhub api
const finnhub = require("finnhub");
const finnhub_api_key = finnhub.ApiClient.instance.authentications["api_key"];
finnhub_api_key.apiKey = process.env.FINNHUB_API_KEY;
const finnhubClient = new finnhub.DefaultApi();

// Login
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}

// Signup
const SignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signUp(
  prevState: string | undefined,
  formData: FormData
) {
  const loginFormData = new FormData();

  try {
    const parsedData = SignUpSchema.safeParse(Object.fromEntries(formData));

    if (!parsedData.success) {
      throw new Error(
        parsedData.error.errors.map((err) => err.message).join(",")
      );
    }

    const { name, email, password } = parsedData.data;

    // Check if user already exists
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.rows.length > 0) {
      throw new Error("User already exists.");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const result = await sql`INSERT INTO users (name, email, password)
  VALUES (${name}, ${email}, ${hashedPassword})
    RETURNING id

  `;
    // Insert cash for the user
    const newUser = result.rows[0];
    await sql`INSERT INTO user_cash (user_id, cash_balance) VALUES (${newUser.id}, 10000.00)`;

    // Log user in
    loginFormData.append("email", email);
    loginFormData.append("password", password);
  } catch (error) {
    return error instanceof Error
      ? error.message
      : "An unexpected error occurred.";
  }
  await authenticate(undefined, loginFormData);
}

// Buy sell actions
export async function getUser() {
  const session = await auth();
  // Check if session and session.user are defined
  if (!session || !session.user) {
    throw new Error("User is not authenticated");
  }
  const user = await sql`SELECT * FROM users WHERE email=${session.user.email}`;
  return user.rows[0];
}

export async function buyStock(
  stockSymbol: string,
  quantity: number,
  price: number,
  password: string,
  transactionType: "buy" | "sell"
) {
  const user = await getUser();
  const userId = user.id;

  const passwordsMatch = await bcrypt.compare(password, user.password);

  try {
    if (!passwordsMatch) {
      throw new Error("Invalid password");
    }

    // Check if user has enough cash
    const userCash = await sql`
    SELECT cash_balance FROM user_cash WHERE user_id = ${userId}
    `;
    const cashBalance = parseFloat(userCash.rows[0]?.cash_balance) || 0;
    const totalCost = quantity * price;

    if (cashBalance < totalCost) {
      throw new Error("Insufficient funds");
    }

    // Deduct the total cost from the user's cash balance

    await sql`
    UPDATE user_cash SET cash_balance = cash_balance - ${totalCost}
    WHERE user_id = ${userId}
    `;

    // Update user_assets to perfrom buy transaction
    await sql`
    INSERT INTO user_assets(user_id, stock_symbol, quantity, average_price)
    VALUES (${userId},${stockSymbol.toLocaleUpperCase()},${quantity},${price})
    ON CONFLICT (user_id, stock_symbol) 
    DO UPDATE SET quantity = user_assets.quantity + EXCLUDED.quantity, 
    average_price = ((user_assets.average_price * user_assets.quantity) + (EXCLUDED.average_price * EXCLUDED.quantity)) 
              / (user_assets.quantity + EXCLUDED.quantity)
    `;

    // Record the transaction
    await sql`
    INSERT INTO transactions (user_id, stock_symbol, quantity, price_at_transaction, transaction_type)
    VALUES (${userId}, ${stockSymbol.toLocaleUpperCase()}, ${quantity}, ${price}, 'buy')
    `;
  } catch (error) {
    console.error("Failed to buy stock:", error);
    throw new Error("Failed to buy stock.");
  }
  revalidatePath("/asset");
  revalidatePath("/transaction");
}

export async function sellStock(
  // userId: string,
  stockSymbol: string,
  quantity: number,
  price: number,
  password: string,
  transactionType: "buy" | "sell"
) {
  const user = await getUser();
  const userId = user.id;

  const passwordsMatch = await bcrypt.compare(password, user.password);

  try {
    if (!passwordsMatch) {
      throw new Error("Invalid password");
    }

    // Check if user has enough stock
    const userStockQuantity = await sql`
    SELECT quantity FROM user_assets WHERE user_id = ${userId} AND stock_symbol = ${stockSymbol.toLocaleUpperCase()} 
    `;
    const stockQuantity = parseFloat(userStockQuantity.rows[0]?.quantity);

    if (!stockQuantity || stockQuantity < quantity) {
      throw new Error("Insufficient stocks");
    }

    const cashGain = quantity * price;
    // Sum the cash gain from the user's cash balance
    await sql`
    UPDATE user_cash SET cash_balance = cash_balance + ${cashGain}
    WHERE user_id = ${userId}
    `;

    // Update user_assets to perfrom sell transaction
    const newQuantity = stockQuantity - quantity;
    if (newQuantity > 0) {
      await sql`
      UPDATE user_assets SET quantity = ${newQuantity}
      WHERE user_id = ${userId} AND stock_symbol = ${stockSymbol.toLocaleUpperCase()}
      `;
    } else {
      await sql`
      DELETE FROM user_assets WHERE user_id = ${userId} AND stock_symbol = ${stockSymbol.toLocaleUpperCase()}
      `;
    }

    // Record the transaction
    await sql`
    INSERT INTO transactions (user_id, stock_symbol, quantity, price_at_transaction, transaction_type)
    VALUES (${userId}, ${stockSymbol.toLocaleUpperCase()}, ${quantity}, ${price}, 'sell')
    `;
  } catch (error) {
    console.error("Failed to sell stock:", error);
    throw new Error(`Failed to sell stock.`);
  }
  revalidatePath("/asset");
  revalidatePath("/transaction");
}

// Fetch User's transaction history
export async function fetchTransactions() {
  const user = await getUser();
  const userId = user.id;

  const transactions = await sql`
  SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY transaction_time DESC
  `;
  return transactions.rows;
}

// Fetch User's assets
export async function fetchAssets() {
  const user = await getUser();
  const userId = user.id;

  const userAssets = await sql`
  SELECT stock_symbol, quantity, average_price FROM user_assets 
  WHERE user_id = ${userId}
  `;

  return userAssets.rows;
}

export async function fetchUserCash() {
  const user = await getUser();
  const userId = user.id;

  const userCash = await sql`
  SELECT cash_balance FROM user_cash
  WHERE user_id = ${userId}
  `;

  return userCash.rows[0].cash_balance;
}

// Fetch best matching stocks based on User's input using Alpha Vantage API
export async function fetchBestMatches(searchText: string) {
  const api_key = process.env.ALPHA_API_KEY;
  const alpha_api = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchText}&apikey=${api_key}`;
  try {
    const res = await axios.get(alpha_api);
    let bestMatches = await res.data["bestMatches"];
    bestMatches = bestMatches.filter(
      (match: BestMatches) => match["8. currency"] === "USD"
    );
    return bestMatches;
  } catch (error) {
    console.error("Failed to fetch best matches:", error);
    throw new Error("Failed to fetch best matches.");
  }
}

// Fetch stock current price and price change using Finnhub API
export async function fetchStockPriceAndChange(
  symbol: string
): Promise<FinnhubQuote> {
  try {
    const result: FinnhubQuote = await new Promise((resolve, reject) => {
      finnhubClient.quote(symbol, (error: any, data: FinnhubQuote | null) => {
        if (error) {
          reject(error);
        } else {
          resolve(data as FinnhubQuote);
        }
      });
    });
    const plainResult = { ...result };
    return plainResult;
  } catch (error) {
    console.error("Failed to fetch stock price and change:", error);
    throw new Error("Failed to fetch stock price and change.");
  }
}

// Fetch stock's financials for 52weeks prices, volume
export async function fetchBasicFinancials(symbol: string) {
  try {
    const result: FinnhubFinancialBasics | null = await new Promise(
      (resolve, reject) => {
        finnhubClient.companyBasicFinancials(
          symbol,
          "margin",
          (error: any, data: FinnhubFinancialBasics | null) => {
            if (error) {
              reject(error);
            } else {
              resolve(data);
            }
          }
        );
      }
    );
    if (result && result.metric) {
      return { ...result.metric };
    }

    // let plainResult = Object.assign({}, result);
    // plainResult = plainResult.metric;
    // return plainResult;
  } catch (error) {
    console.error("Failed to fetch basic financials:", error);
    throw new Error("Failed to fetch basic financials.");
  }
}

// Fetch stock graph data
export async function fetchStockGraphData(
  symbol: string,
  period: "1d" | "1m" | "1y" | "2y"
) {
  let interval: "1m" | "1d" | "1wk" | "1mo" = "1d"; // Default interval
  let period1 = new Date();

  // Adjust interval and range based on the selected period
  switch (period) {
    case "1d":
      period1 = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
      interval = "1m"; // 1-minute interval for 1-day view
      break;
    case "1m":
      period1 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 1 month ago
      interval = "1d"; // 1-day interval for 1-month view
      break;
    case "1y":
      period1 = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
      interval = "1wk"; // 1-week interval for 1-year view
      break;
    case "2y":
    default:
      period1 = new Date(Date.now() - 730 * 24 * 60 * 60 * 1000); // 2 years ago
      interval = "1mo"; // 1-month interval for 2-years view
      break;
  }

  try {
    const result = await yahooFinance.chart(symbol, {
      period1: period1.toISOString(),
      interval,
      return: "object",
    });
    return result;
  } catch (error) {
    console.error(`Error fetching chart data for ${symbol}:`, error);
    return null;
  }
}
