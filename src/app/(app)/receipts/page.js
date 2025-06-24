import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default async function ReceiptPage({ searchParams }) {
  const awaitedSearchParams = await searchParams;
  const queryParam = awaitedSearchParams.q;
  const searchQuery = Array.isArray(queryParam)
    ? queryParam[0]
    : queryParam || "";

  const res = await fetch("https://v1.appbackend.io/v1/rows/Cob8vdpflXK7");
  const { data: allReceipts } = await res.json();

  const filteredReceipts = allReceipts.filter((receipt) => {
    if (!searchQuery) {
      return true;
    }
    const recipeName = receipt.nama_resep;
    if (!recipeName) {
      return false;
    }
    return recipeName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const receiptsToDisplay = filteredReceipts;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {receiptsToDisplay.length > 0 ? (
          receiptsToDisplay.map((receipt) => (
            <Link
              href={`/receipts/${receipt._id}`}
              key={receipt._id}
              className="block"
            >
              <Card className="rounded-xl shadow-md border border-gray-200 overflow-hidden bg-white hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <div className="relative w-full h-48 sm:h-56 rounded-t-xl overflow-hidden">
                  {receipt.foto_resep && (
                    <Image
                      src={receipt.foto_resep}
                      alt={receipt.nama_resep || "Resep"}
                      fill
                      style={{ objectFit: "cover" }}
                      className="object-center transition-transform duration-300 hover:scale-105"
                      priority
                      sizes="100vw"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-xl sm:text-2xl leading-tight line-clamp-2">
                      {receipt.nama_resep}
                    </h3>
                    <div className="flex items-center mt-1">
                      <div className="w-6 h-6 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-xs text-gray-700 font-semibold overflow-hidden">
                        {receipt.username
                          ? receipt.username.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <span className="text-sm font-medium">
                        {receipt.username || "Anonim"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-lg mt-8">
            Tidak ada resep yang ditemukan untuk pencarian Anda.
          </p>
        )}
      </div>
    </div>
  );
}
