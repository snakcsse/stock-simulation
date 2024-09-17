import bcrypt from "bcrypt";
import { db } from "@vercel/postgres";
import { users } from "@/app/lib/placeholder-data";

const client = await db.connect();

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

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await client.sql`COMMIT`; // Commit the changes such that the changes are made to the db

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    await client.sql`ROLLBACK`; // if something goes wrong, all changes will be discarded
    return Response.json({ error }, { status: 500 });
  }
}
