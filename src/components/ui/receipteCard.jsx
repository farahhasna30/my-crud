// components/recipes/RecipeCard.jsx
"use client"; // Ini adalah Client Component karena ada interaksi seperti hover

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Bookmark, Clock, Users, User2 } from "lucide-react"; // Ikon

export function RecipeCard({ recipe }) {
  // --- PERBAIKAN: Validasi URL gambar untuk mencegah string kosong di src ---
  const recipeImageUrl =
    recipe.image_url &&
    typeof recipe.image_url === "string" &&
    recipe.image_url !== ""
      ? recipe.image_url
      : "/placeholder-recipe.jpg"; // Fallback ke placeholder jika kosong/null

  const authorAvatarUrl =
    recipe.author_avatar &&
    typeof recipe.author_avatar === "string" &&
    recipe.author_avatar !== ""
      ? recipe.author_avatar
      : "/placeholder-author.png"; // Fallback ke placeholder

  return (
    <Card
      className="rounded-xl shadow-md border border-gray-200 overflow-hidden bg-white
                   hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col"
    >
      {/* Gambar Resep */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={recipeImageUrl} // Gunakan URL gambar yang sudah divalidasi
          alt={recipe.nama_resep || "Resep Makanan"}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-200 hover:scale-105"
        />
        <Bookmark
          size={24}
          className="absolute top-3 right-3 text-white/90 hover:text-yellow-400 transition-colors z-10"
          fill="currentColor"
        />

        {recipe.author === "DAPUR SELERA" && ( // Asumsi DAPUR SELERA adalah badge khusus
          <div className="absolute bottom-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
            DAPUR SELERA
          </div>
        )}
      </div>

      <CardContent className="p-4 flex flex-col flex-grow space-y-3">
        {/* Judul Resep */}
        <CardTitle className="text-xl font-bold text-gray-900 leading-tight line-clamp-2">
          {recipe.nama_resep}
        </CardTitle>

        {/* Info Cepat (Waktu & Porsi) */}
        {recipe.time || recipe.servings ? ( // Render hanya jika ada info
          <div className="flex items-center space-x-4 text-gray-600 text-sm">
            {recipe.time && (
              <div className="flex items-center space-x-1">
                <Clock size={16} /> <span>{recipe.time}</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center space-x-1">
                <Users size={16} /> <span>{recipe.servings}</span>
              </div>
            )}
          </div>
        ) : null}

        {/* Preview Bahan / Deskripsi Singkat */}
        <CardDescription className="text-gray-700 text-sm line-clamp-2">
          {recipe.bahan_preview ||
            recipe.bahan ||
            "Tidak ada preview bahan tersedia."}
        </CardDescription>

        {/* Info Author */}
        {recipe.author && ( // Render hanya jika ada author
          <div className="flex items-center space-x-2 text-gray-600 text-sm mt-auto pt-2 border-t border-gray-100">
            <Image
              src={authorAvatarUrl}
              alt={recipe.author}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span>{recipe.author}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
