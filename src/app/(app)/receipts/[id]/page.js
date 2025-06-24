// app/receipts/[id]/page.js
// Ini adalah Server Component.
// JANGAN ADA "use client"; di bagian paling atas file ini.
// JANGAN ADA import dari "useSearchParams" dari "next/navigation" di sini.

import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// Pastikan komponen yang diimpor tidak memanggil useSearchParams() secara internal
// Jika Anda punya komponen seperti Button, Link, dll. dari 'lucide-react', pastikan itu sudah ada di tempat lain
// atau diimpor di sini. Saya akan tambahkan beberapa import yang mungkin Anda butuhkan.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // Jika Anda menggunakan ikon ini

// Fungsi untuk memformat daftar bahan-bahan
function formatBahanList(bahanText) {
  if (!bahanText) return [];
  // Split berdasarkan baris baru, hapus spasi, dan filter yang kosong
  return bahanText
    .split(/[\n\r]+/) // Memastikan split juga mengenali '\r\n'
    .filter((item) => item.trim() !== "")
    .map((item, index) => <li key={index}>{item.trim()}</li>);
}

// Fungsi untuk memformat cara membuat
function formatCaraMembuatList(caraMembuatText) {
  if (!caraMembuatText) return [];
  return caraMembuatText
    .split(/[\n\r]+(?=\d+\.\s*)/) // Memastikan split antar langkah bernomor
    .filter(Boolean)
    .map((paragraph, pIndex) => {
      const match = paragraph.match(/^(\d+\.\s*)(.*)/s); // Menggunakan /s flag untuk dotAll
      if (match) {
        const [, stepNumber, stepText] = match;
        return (
          <li key={pIndex} className="flex items-start mb-2">
            <span className="font-bold text-primary mr-2 flex-shrink-0">
              {stepNumber}
            </span>
            <p className="flex-1 text-gray-700">{stepText.trim()}</p>
          </li>
        );
      }
      return (
        <li key={pIndex} className="mb-2 text-gray-700 text-justify">
          {paragraph.trim()}
        </li>
      );
    });
}

// Fungsi untuk mengambil detail resep berdasarkan ID
// Ini adalah Server Function, bukan komponen
async function getRecipeDetail(id) {
  console.log(`[DETAIL-FETCH] Attempting to fetch recipe with ID: ${id}`);
  const res = await fetch(
    `https://v1.appbackend.io/v1/rows/Cob8vdpflXK7?id=${id}`, // <--- Perhatikan ini: ID sebagai query param
    { next: { revalidate: 60 } } // Revalidate data setiap 60 detik (1 menit)
  );

  if (!res.ok) {
    console.error(
      `[DETAIL-FETCH-ERROR] Failed to fetch recipe ID ${id}: ${res.status} ${res.statusText}`
    );
    const errorBody = await res.text();
    console.error(`[DETAIL-FETCH-ERROR] Response Body: ${errorBody}`);
    return null;
  }

  const result = await res.json();
  console.log(`[DETAIL-FETCH-SUCCESS] Fetched data for ID ${id}:`, result);

  // appbackend.io /v1/rows/{tableId}?id={rowId} sering mengembalikan { data: [item] }
  // Jadi kita perlu mengakses properti 'data' dan mengambil item pertama
  if (result && result.data && result.data.length > 0) {
    return result.data[0];
  }

  return null; // Mengembalikan null jika tidak ada data atau formatnya tidak sesuai
}

// Komponen Halaman Detail Resep
export default async function ReceiptDetailPage({ params }) {
  // Pastikan TIDAK ADA useSearchParams() di sini.
  // Query params untuk halaman detail biasanya tidak perlu karena ID sudah ada di params.id.
  // 'searchParams' hanya perlu ditambahkan jika Anda berencana menggunakan query params di halaman detail ini
  // seperti '/receipts/123?version=v2'. Jika tidak, 'searchParams' tidak perlu menjadi prop di sini.
  // Kalau ada, biarkan saja: export default async function ReceiptDetailPage({ params, searchParams }) {

  const { id } = params; // Dapatkan ID dari URL

  const receipt = await getRecipeDetail(id);

  if (!receipt) {
    console.error(
      `[RENDER-ERROR] Recipe with ID ${id} not found after fetch, triggering notFound().`
    );
    notFound(); // Menggunakan Next.js notFound() helper
  }

  const { nama_resep, foto_resep, deskripsi_resep, bahan, cara_membuat } =
    receipt;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
      <Card className="rounded-lg shadow-lg border border-gray-200 bg-white">
        {/* Bagian Gambar Resep */}
        {foto_resep && (
          <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-t-lg">
            <Image
              src={foto_resep}
              alt={nama_resep || "Resep"}
              fill
              style={{ objectFit: "cover" }}
              className="object-center"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimasi sizes
              onError={(e) =>
                console.error(
                  `[IMAGE-LOAD-ERROR] Failed to load image for ${nama_resep}: ${e.target.src}`
                )
              }
            />
          </div>
        )}

        <CardHeader className="p-6 pb-2">
          {/* Tombol kembali */}
          <Link
            href="/receipts"
            className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" /> Kembali ke Daftar Resep
          </Link>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
            {nama_resep}
          </CardTitle>
          {deskripsi_resep && (
            <CardDescription className="text-gray-600 mt-2 text-lg">
              {deskripsi_resep}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="p-6 pt-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Bahan-bahan
            </h2>
            {bahan ? (
              <ul className="list-disc pl-5 space-y-1 text-gray-700 text-base leading-relaxed">
                {formatBahanList(bahan)}
              </ul>
            ) : (
              <p className="text-gray-500">Bahan-bahan tidak tersedia.</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Cara Membuat
            </h2>
            {cara_membuat ? (
              <ol className="list-decimal list-inside space-y-2 text-gray-700 text-base leading-relaxed">
                {formatCaraMembuatList(cara_membuat)}
              </ol>
            ) : (
              <p className="text-gray-500">Cara membuat tidak tersedia.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// generateStaticParams - Ini juga Server Component
export async function generateStaticParams() {
  console.log("[GENERATE_STATIC_PARAMS] Starting...");
  const res = await fetch("https://v1.appbackend.io/v1/rows/Cob8vdpflXK7", {
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(
      `[GENERATE_STATIC_PARAMS_ERROR] Failed to fetch all receipts for static params: ${res.status} ${res.statusText}`
    );
    return []; // Return empty array to prevent build failure if this fetch fails
  }
  const { data: receipts } = await res.json();
  console.log(
    `[GENERATE_STATIC_PARAMS_SUCCESS] Found ${receipts.length} receipts.`
  );
  return receipts.map((receipt) => ({
    id: receipt._id,
  }));
}
