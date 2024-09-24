import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* Top Left Title Section */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <div className="w-10 h-10 bg-sky-300 flex items-center justify-center rounded">
          <StarIcon className="h-6 w-6 text-white" />
        </div>
        <span className="text-sky-300 font-semibold text-3xl">GrowStocks</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row-reverse items-center justify-between w-full px-8 lg:px-32">
        {/* Middle Left Section (Now moved to the right) */}
        <div className="lg:w-1/2 space-y-6 text-left">
          <h1 className="text-3xl lg:text-4xl font-bold">
            Stock <span className="text-sky-300">Simulation</span> App
          </h1>
          <p className="text-gray-500 text-lg">
            Practice stock buying and selling if you are not comfortable with it
          </p>

          {/* Buttons */}
          <div className="space-x-4">
            <Link href="/signup">
              <button className="bg-sky-300 text-white px-6 py-2 rounded-md hover:bg-sky-400 transition">
                Signup
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-sky-300 text-white px-6 py-2 rounded-md hover:bg-sky-400 transition">
                Login
              </button>
            </Link>
          </div>
        </div>

        {/* Middle Right Section (Now moved to the left) */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 hidden lg:block">
          {/* Placeholder for stock chart image */}
          <Image
            src="/stock-chart.jpg" // Add your stock chart image here
            alt="Stock Chart"
            width={500}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
