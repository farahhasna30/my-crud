"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, Plus, BookMarkedIcon } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { logout } from "../action";
import Image from "next/image";

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.replace(`/receipts?q=${encodeURIComponent(searchTerm)}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== searchTerm) {
      setSearchTerm(q || "");
    }
  }, [searchParams, searchTerm]);

  return (
    <form onSubmit={handleSearchSubmit} className="w-full relative">
      <Input
        placeholder="Cari resep..." // Ubah placeholder agar lebih umum
        className="pl-10 pr-4 py-2 rounded-full bg-gray-100 border-none focus:bg-white focus:ring-1 focus:ring-blue-400 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <button type="submit" className="sr-only">
        Cari
      </button>
    </form>
  );
}

export default function RecipesLayout({ children }) {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 p-4 flex flex-col shadow-sm">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/cookpad.png"
              alt="Cookpad Logo"
              width={60}
              height={60}
              priority
            />
            <span className="text-2xl font-bold text-gray-800">cookbook</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-gray-700"
          >
            <Menu size={20} />{" "}
          </Button>
        </div>
        <nav className="flex-grow space-y-2 text-lg">
          <Link
            href="/receipts"
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
          >
            <BookMarkedIcon size={20} className="text-gray-500" />{" "}
            <span>All Recipes</span>{" "}
          </Link>
          <Link
            href="/posting-bareng"
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
          >
            <Plus size={20} className="text-gray-500" />{" "}
            <span>Posting Bareng</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-40 bg-white shadow-sm py-4 px-6 flex items-center justify-between border-b border-gray-200">
          <div className="relative flex-grow max-w-lg mx-auto">
            <Suspense fallback={<div>Loading search...</div>}>
              <SearchComponent />
            </Suspense>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleLogout}
              className="rounded-full text-gray-500"
            >
              Logout
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
