import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <div className="flex flex-col justify-center h-screen bg-gray-50">
      {/* Top Left Title Section */}
      <div className="absolute top-8 left-20 flex items-center space-x-2">
        <div className="w-10 h-10 bg-sky-500 flex items-center justify-center rounded">
          <StarIcon className="h-6 w-6 text-white" />
        </div>
        <span className="text-sky-500 font-semibold text-3xl">GrowStocks</span>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-start w-full px-20 justify-center">
        {/* Middle Left Section */}
        <div className="lg:w-1/2 space-y-6 text-left lg:pt-32">
          <h1 className="text-4xl lg:text-4xl font-bold">
            Stock <span className="text-sky-500">Simulation</span> App
          </h1>
          <p className="text-gray-500 text-lg">
            Practice buying and selling stocks to become comfortable with
            trading!
          </p>

          {/* Buttons */}
          <div className="flex space-x-4">
            <Link href="/signup">
              <button className="bg-sky-500 text-white w-[100px] px-6 py-2 rounded-md hover:bg-sky-400 transition">
                Signup
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-sky-500 text-white w-[100px] px-6 py-2 rounded-md hover:bg-sky-400 transition">
                Login
              </button>
            </Link>
          </div>
        </div>

        {/* Middle Right Section (Now moved to the left) */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 hidden lg:block">
          {/* Placeholder for stock chart image */}
          <Image
            src="/stock-chart.JPG"
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
