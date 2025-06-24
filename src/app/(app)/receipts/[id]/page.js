import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

async function getReceiptById(id) {
  const res = await fetch(
    `https://v1.appbackend.io/v1/rows/Cob8vdpflXK7/${id}`
  );

  if (!res.ok) {
    console.error(
      `Failed to fetch recipe with ID ${id}: ${res.status} ${res.statusText}`
    );
    return null;
  }

  const data = await res.json();
  return data || null;
}

function formatBahanList(bahanText) {
  if (!bahanText) return [];
  return bahanText
    .split("\n")
    .filter((item) => item.trim() !== "")
    .map((item, index) => <li key={index}>{item.trim()}</li>);
}

function formatCaraMembuatList(caraMembuatText) {
  if (!caraMembuatText) return [];

  return caraMembuatText
    .split("\n\n")
    .filter(Boolean)
    .map((paragraph, pIndex) => {
      const match = paragraph.match(/^(\d+\.\s)(.*)/);
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

export default async function ReceiptDetailPage({ params }) {
  const { id } = params;
  const receipt = await getReceiptById(id);

  if (!receipt) {
    console.log(`Recipe with ID ${id} not found, displaying 404.`);
    notFound();
  }

  const { nama_resep, foto_resep, deskripsi_resep, bahan, cara_membuat } =
    receipt;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-3xl">
      <Card className="rounded-lg shadow-lg border border-gray-200 bg-white">
        {/* Bagian Gambar Resep */}
        {foto_resep && ( // Menggunakan 'foto_resep'
          <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-t-lg">
            <Image
              src={foto_resep} // Menggunakan 'foto_resep'
              alt={nama_resep || "Resep"}
              fill
              style={{ objectFit: "cover" }}
              className="object-center"
              priority
              sizes="100vw"
            />
          </div>
        )}

        <CardHeader className="p-6 pb-2">
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

// generateStaticParams tetap seperti sebelumnya
export async function generateStaticParams() {
  const res = await fetch("https://v1.appbackend.io/v1/rows/Cob8vdpflXK7");
  const { data: receipts } = await res.json();

  return receipts.map((receipt) => ({
    id: receipt._id,
  }));
}
