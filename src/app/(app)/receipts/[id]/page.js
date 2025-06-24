import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { fetchAllRecipes } from "@/lib/api";

async function getReceiptById(id) {
  if (!id) {
    console.error(
      `[BUILD-FETCH] Attempted to fetch with invalid ID: ${id}. Skipping API call.`
    );
    return null;
  }

  console.log(
    `[BUILD-FETCH] Attempting to fetch ALL recipes to find ID: ${id}`
  );
  try {
    const allRecipes = await fetchAllRecipes(); // <--- Panggil fungsi baru
    const foundRecipe = allRecipes.find((recipe) => recipe._id === id);

    if (foundRecipe) {
      console.log(`[SUCCESS FETCH] Recipe for ID ${id} found locally in list.`);
    } else {
      console.log(
        `[NOT_FOUND] Recipe with ID ${id} not found in the fetched list.`
      );
    }
    return foundRecipe || null;
  } catch (error) {
    console.error(
      `[BUILD-FETCH-ERROR] Error in getReceiptById for ID ${id}:`,
      error.message
    );
    return null;
  }
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
    .split("\n")
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
  const { id } = await params;
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
        {foto_resep && (
          <div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-t-lg">
            <Image
              src={foto_resep}
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
              <ol className="list-decimal list-inside space-y-1 text-gray-700 text-base leading-relaxed">
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
