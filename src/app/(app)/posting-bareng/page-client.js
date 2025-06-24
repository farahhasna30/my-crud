"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CLOUDINARY_CLOUD_NAME = "duimeoiti";
const CLOUDINARY_UPLOAD_PRESET = "my_recipe_upload";

export default function PostingResepForm({ initialUsername }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedInUsername, setLoggedInUsername] = useState(
    initialUsername || ""
  );
  const [fotoResepFile, setFotoResepFile] = useState(null);

  useEffect(() => {
    console.log(
      "Initial Username received (Client Component):",
      initialUsername
    );
  }, [initialUsername, router]);

  async function uploadImageToCloudinary(file) {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error.message || "Gagal mengunggah gambar ke Cloudinary."
        );
      }

      const result = await response.json();
      return result.secure_url;
    } catch (err) {
      console.error("Error uploading image to Cloudinary:", err);
      throw new Error(`Gagal mengunggah foto resep: ${err.message}`);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.target);
    const nama_resep = formData.get("nama_resep");
    const deskripsi_resep = formData.get("deskripsi_resep");
    const bahan = formData.get("bahan");
    const cara_membuat = formData.get("cara_membuat");

    if (!nama_resep || !bahan || !cara_membuat || !fotoResepFile) {
      setError("Semua field wajib diisi, termasuk foto resep.");
      setIsLoading(false);
      toast.error("Validasi Gagal", {
        description: "Semua field wajib diisi, termasuk foto resep.",
      });
      return;
    }

    if (!loggedInUsername) {
      setError("Username tidak ditemukan. Silakan login kembali.");
      setIsLoading(false);
      toast.error("Error Posting", {
        description: "Username tidak ditemukan. Silakan login kembali.",
      });
      return;
    }

    let foto_resep_url = "";

    try {
      console.log("File yang akan diunggah ke Cloudinary:", fotoResepFile);
      foto_resep_url = await uploadImageToCloudinary(fotoResepFile);
      console.log("URL diterima dari Cloudinary:", foto_resep_url);

      if (!foto_resep_url) {
        throw new Error(
          "Gagal mendapatkan URL foto resep setelah diunggah ke Cloudinary."
        );
      }

      const payload = [
        {
          nama_resep: nama_resep,
          deskripsi_resep: deskripsi_resep,
          bahan: bahan,
          cara_membuat: cara_membuat,
          foto_resep: foto_resep_url,
          username: loggedInUsername,
        },
      ];

      console.log("Final Payload yang dikirim ke AppBackend.io:", payload);

      const response = await fetch(
        "https://v1.appbackend.io/v1/rows/Cob8vdpflXK7",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("Status Respon dari AppBackend.io:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response Data dari AppBackend.io:", errorData);
        throw new Error(
          errorData.message || "Gagal menyimpan resep ke AppBackend.io."
        );
      }

      const result = await response.json();
      console.log(
        "Resep berhasil diposting. Respons API AppBackend.io:",
        result
      );

      toast.success("Resep Berhasil Diposting!", {
        description: "Resep Anda telah berhasil ditambahkan.",
      });

      event.target.reset();
      setFotoResepFile(null);
      router.push("/receipts");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memposting resep.");
      toast.error("Gagal Posting", {
        description: err.message || "Terjadi kesalahan saat memposting resep.",
      });
      console.error("Catch Block Error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="max-w-2xl mx-auto shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800 text-center">
            Posting Resep Baru
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Bagikan resep kreasi Anda dengan komunitas!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="nama_resep">Nama Resep</Label>
              <Input
                id="nama_resep"
                name="nama_resep"
                type="text"
                placeholder="Misal: Brownies Lumer Keju"
                required
              />
            </div>
            <div>
              <Label htmlFor="deskripsi_resep">
                Deskripsi Resep (Opsional)
              </Label>
              <Textarea
                id="deskripsi_resep"
                name="deskripsi_resep"
                placeholder="Deskripsi singkat tentang resep Anda..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="bahan">Bahan-bahan</Label>
              <Textarea
                id="bahan"
                name="bahan"
                placeholder="List bahan, setiap baris untuk satu item&#10;Contoh:&#10;250g tepung terigu&#10;100g gula pasir"
                rows={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="cara_membuat">Cara Membuat</Label>
              <Textarea
                id="cara_membuat"
                name="cara_membuat"
                placeholder="Langkah-langkah pembuatan, setiap baris untuk satu langkah&#10;Contoh:&#10;Campurkan semua bahan kering&#10;Tambahkan bahan basah..."
                rows={15}
                required
              />
            </div>
            <div>
              <Label htmlFor="foto_resep_upload">Foto Resep</Label>
              <Input
                id="foto_resep_upload"
                name="foto_resep_upload"
                type="file"
                accept="image/*"
                required
                onChange={(e) => setFotoResepFile(e.target.files[0])}
              />
              <p className="text-sm text-gray-500 mt-1">
                Unggah foto resep terbaik Anda.
              </p>
            </div>

            {loggedInUsername && (
              <p className="text-sm text-gray-600">
                Memposting sebagai:{" "}
                <span className="font-semibold">{loggedInUsername}</span>
              </p>
            )}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sedang Memposting..." : "Posting Resep"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
