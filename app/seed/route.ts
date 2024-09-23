import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
import { users } from "@/app/lib/placeholder-data";

const client = await db.connect();

// Create user table and seed example user
async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`; // use PostgreSQL uuid-ossp extension to generate universally unique identifiers
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email TEXT NOT NULL UNIQUE,
     password TEXT NOT NULL
    )
    `;
  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`INSERT INTO users (id, name, email, password) VALUES
            (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
            ON CONFLICT (id) DO NOTHING`;
    })
  );

  return insertedUsers;
}

async function createTables() {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
      CREATE TABLE IF NOT EXISTS user_cash (
      user_id UUID PRIMARY KEY REFERENCES users(id),
      cash_balance NUMERIC NOT NULL DEFAULT 10000.00
      )
    `;

    // Create user_assets table
    await client.sql`
    CREATE TABLE IF NOT EXISTS user_assets (
      user_id UUID REFERENCES users(id),
      stock_symbol VARCHAR(10),
      quantity INT NOT NULL,
      price NUMERIC(15, 2) NOT NULL,
      PRIMARY KEY (user_id, stock_symbol)
    )
    `;

    // Create transactions table
    await client.sql`
    CREATE TABLE IF NOT EXISTS transactions (
      transaction_id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id),
      stock_symbol VARCHAR(10),
      quantity INT NOT NULL,
      price_at_transaction NUMERIC(15, 2) NOT NULL,
      transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('buy','sell')),
      transaction_time TIMESTAMP NOT NULL DEFAULT NOW()
    )
    `;

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    // await seedUsers();
    await createTables();
    await client.sql`COMMIT`; // Commit the changes such that the changes are made to the db

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`; // if something goes wrong, all changes will be discarded
    return Response.json({ error }, { status: 500 });
  }
}
