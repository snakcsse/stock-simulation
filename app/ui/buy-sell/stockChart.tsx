import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { fetchStockGraphData } from "@/app/lib/actions";
import { ChartData } from "@/app/lib/definitions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function StockChart({ symbol }: { symbol: string }) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [period, setPeriod] = useState<"1d" | "1m" | "1y" | "2y">("2y"); // Default period: 2 years

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return; // Prevent fetching if symbol isn't ready

      let data;
      try {
        data = await fetchStockGraphData(symbol, period);
      } catch (err) {
        return <p>Stock chart is currently unavailable</p>;
      }

      if (
        data &&
        data.timestamp &&
        data.timestamp.length > 0 &&
        data.indicators.quote[0]
      ) {
        const timestamps = data.timestamp;
        const closePrices = data.indicators.quote[0].close;

        const labels = timestamps.map((timestamp) =>
          new Date(timestamp * 1000).toLocaleDateString()
        );

        setChartData({
          labels,
          datasets: [
            {
              label: `${symbol.toUpperCase()}`,
              data: closePrices,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              pointRadius: 0, // No points to keep the chart cleaner
              fill: true,
            },
          ],
        });
      } else {
        console.error("No data found for the stock.");
      }
    };

    fetchStockData();
  }, [symbol, period]);

  const handlePeriodChange = (newPeriod: "1d" | "1m" | "1y" | "2y") => {
    setPeriod(newPeriod);
  };

  // Determine x-axis unit based on selected period
  const getXUnit = () => {
    switch (period) {
      case "1d":
        return "hour";
      case "1m":
        return "day";
      case "1y":
      case "2y":
        return "month";
      default:
        return "month"; // Fallback
    }
  };

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <div className="mb-4 flex flex-wrap justify-around gap-2 sm:gap-4">
        {/* Period selection buttons */}
        {["1d", "1m", "1y", "2y"].map((p) => (
          <button
            key={p}
            onClick={() => handlePeriodChange(p as "1d" | "1m" | "1y" | "2y")}
            className="bg-sky-500 text-white px-2 py-1 text-xs rounded hover:bg-sky-600 transition sm:text-sm sm:px-3 sm:py-2 md:text-xs"
          >
            {p}
          </button>
        ))}
      </div>
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              grid: {
                color: "rgba(200, 200, 200, 0.1)",
              },
              title: {
                display: true,
                color: "#333",
                font: {
                  size: 10,
                },
              },
              ticks: {
                autoSkip: true, // Automatically skip labels
                maxTicksLimit: 15, // Limit the maximum number of ticks
                font: {
                  size: 10,
                },
              },
            },
            y: {
              grid: {
                color: "rgba(200, 200, 200, 0.1)",
              },
              title: {
                display: true,
                text: "Price ($)",
                color: "#333",
                font: {
                  size: 10,
                },
              },
              ticks: {
                font: {
                  size: 10,
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              titleColor: "#333",
              bodyColor: "#333",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          },
        }}
      />
    </div>
  );
}
