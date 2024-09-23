"use server";
import { auth } from "@/auth";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import yahooFinance from "yahoo-finance2";
import bcrypt from "bcrypt";

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
    await sql`INSERT INTO user_cash (user_id, cash_balance) VALUES (${newUser.id}, 100000.00)`;
    redirect("/login");
  } catch (error) {
    throw error;
  }
}

// Add buy sell action
export async function getUser() {
  const session = await auth();
  const user = await sql`SELECT * FROM users WHERE email=${session.user.email}`;
  return user.rows[0];
}

export async function buyStock(
  // userId: string,
  stockSymbol: string,
  quantity: number,
  price: number,
  password: string,
  transactionType: "buy" | "sell"
) {
  // const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
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
    VALUES (${userId},${stockSymbol},${quantity},${price})
    ON CONFLICT (user_id, stock_symbol) 
    DO UPDATE SET quantity = user_assets.quantity + EXCLUDED.quantity, 
    average_price = ((user_assets.average_price * user_assets.quantity) + (EXCLUDED.average_price * EXCLUDED.quantity)) 
              / (user_assets.quantity + EXCLUDED.quantity)
    `;

    // Record the transaction
    await sql`
    INSERT INTO transactions (user_id, stock_symbol, quantity, price_at_transaction, transaction_type)
    VALUES (${userId}, ${stockSymbol}, ${quantity}, ${price}, 'buy')
    `;

    console.log("Stock purchase successful!");
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
    SELECT quantity FROM user_assets WHERE user_id = ${userId} AND stock_symbol = ${stockSymbol} 
    `;
    const stockQuantity = parseFloat(userStockQuantity.rows[0]?.quantity);

    if (stockQuantity < quantity) {
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
      WHERE user_id = ${userId} AND stock_symbol = ${stockSymbol}
      `;
    } else {
      await sql`
      DELETE FROM user_assets WHERE user_id = ${userId} AND stock_symbol = ${stockSymbol}
      `;
    }

    // Record the transaction
    await sql`
    INSERT INTO transactions (user_id, stock_symbol, quantity, price_at_transaction, transaction_type)
    VALUES (${userId}, ${stockSymbol}, ${quantity}, ${price}, 'sell')
    `;

    console.log("Stock sold successful!");
  } catch (error) {
    console.error("Failed to sell stock:", error);
    throw new Error("Failed to sell stock.");
  }
  revalidatePath("/asset");
  revalidatePath("/transaction");
}

export async function fetchTransactions() {
  const user = await getUser();
  const userId = user.id;

  const transactions = await sql`
  SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY transaction_time DESC
  `;
  return transactions.rows;
}

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

export async function fetchStockInfo(symbol) {
  const user = await getUser();
  const userId = user.id;

  try {
    const queryOptions = {
      modules: ["price", "summaryDetail"],
    };
    const data = await yahooFinance.quoteSummary(symbol, queryOptions);
    return data;
  } catch (error) {
    console.error("Failed to fetch stock:", error);
    throw new Error("Failed to fetch stock.");
  }
}
