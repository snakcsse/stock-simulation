# Stock Simulation <small>(Ongoing Development)</small>

Stock Simulation is a Next.js app that enables users to practice trading by simulating the buying and selling of stocks. Users can track their simulated investments and see how their strategies perform over time.

Users can easily search for stocks by entering symbols or company keywords, and the app provides suggestions for the best matching stocks.

Upcoming features include the addition of stock suggestions for premium users.

The app leverages multiple APIs, including Alpha Vantage, Finnhub, and Yahoo Finance, to fetch stock data. This approach helps mitigate the impact of rate limits imposed by these APIs.

Optimized for both desktop and mobile devices.

### Live Demo

Check out the current version of the app [here](https://stock-simulation-two.vercel.app/)

## Installation

To set up the project locally, please follow these steps:

1. **Clone the repo**

   ```bash
   git clone https://github.com/snakcsse/stock-simulation.git
   ```

2. **Create environment variables**

   - Create a '.env' file in the root directory with the following variables:

   #### `.env` File

   ```env
   AUTH_SECRET=your-auth-secret

   POSTGRES_URL=your-postgres-url
   POSTGRES_PRISMA_URL=your-postgres-prisma-url
   POSTGRES_URL_NO_SSL=your-postgres-url-no-ssl
   POSTGRES_URL_NON_POOLING=your-url-non-pooling
   POSTGRES_USER=your-postgres-user
   POSTGRES_HOST=your-postgres-host
   POSTGRES_PASSWORD=your-postgres-password
   POSTGRES_DATABASE=your-postgres-database

   ALPHA_API_KEY=your-alpha-vantage-free-api-key
   FINNHUB_API_KEY=your-finnhub-free-api-key
   ```

3. **Install dependencies**

   - Run the below code in the rool directory to install the dependencies

   ```
    pnpm install
   ```

4. **Run the application**

   ```
   pnpm run dev
   ```

   - Visit the following URL in your browser to create tables and seed placeholder-data for the databases. Make sure to have the database configured properly before seeding.

   ```
   http://localhost:3000/seed
   ```

## Technology Stack

- Next.js
- TypeScript
- PostgreSQL

## Author

Seita Nakagawa

## License

This project is licensed under the MIT License - see the LICENSE file for details.
