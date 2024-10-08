import { signOut } from "@/auth";
import { StarIcon } from "@heroicons/react/24/solid";
import {
  FolderIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function SideNav({
  setIsSidebarOpen,
}: {
  setIsSidebarOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className="h-full p-4 flex flex-col">
      {/* Top Left Title Section */}
      <div className="flex items-center space-x-2 mb-8 mt-4 ">
        <div className="w-10 h-10 bg-sky-500 flex items-center justify-center rounded">
          <StarIcon className="h-6 w-6 text-white" />
        </div>
        <span className="text-sky-500 font-semibold text-3xl">GrowStocks</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
        <Link href="/my-page/assets">
          <div
            className="flex items-center p-2 rounded-md hover:bg-sky-300 cursor-pointer transition"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FolderIcon className="h-6 w-6 text-gray-700" />
            <span className="ml-2 text-gray-700">Assets</span>
          </div>
        </Link>
        <Link href="/my-page/transactions">
          <div
            className="flex items-center p-2 rounded-md hover:bg-sky-300 cursor-pointer transition"
            onClick={() => setIsSidebarOpen(false)}
          >
            <DocumentTextIcon className="h-6 w-6 text-gray-700" />
            <span className="ml-2 text-gray-700">Transactions</span>
          </div>
        </Link>
        <Link href="/my-page/buy-sell">
          <div
            className="flex items-center p-2 rounded-md hover:bg-sky-300 cursor-pointer transition"
            onClick={() => setIsSidebarOpen(false)}
          >
            <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
            <span className="ml-2 text-gray-700">Trade</span>
          </div>
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto flex items-center p-2 rounded-md hover:bg-red-300 cursor-pointer transition">
        <button
          className="flex w-full"
          onClick={async () => {
            await signOut();
          }}
        >
          <PowerIcon className="h-6 w-6 text-gray-700" />
          <span className="ml-2 text-gray-700">Logout</span>
        </button>
      </div>
    </div>
  );
}
