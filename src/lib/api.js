export async function safeJsonFetch(url, options = {}) {
  let res;
  try {
    res = await fetch(url, options);
  } catch (networkError) {
    console.error(
      `[FETCH ERROR] Network or CORS issue for ${url}:`,
      networkError
    );
    throw new Error(
      `Network or API unreachable. Please check your internet connection or API status. (${
        networkError.message || networkError
      })`
    );
  }

  // Periksa jika response tidak OK (misal: 4xx, 5xx)
  if (!res.ok) {
    let errorText = ``;
    try {
      errorText = await res.text(); // Coba ambil body sebagai teks
    } catch (readError) {
      console.error(
        `[FETCH ERROR] Failed to read error response text for ${url}:`,
        readError
      );
    }
    console.error(
      `[API ERROR] Non-OK response for ${url}: ${res.status} ${
        res.statusText
      }. Body: ${errorText.substring(0, Math.min(errorText.length, 200))}...`
    );
    throw new Error(
      `API responded with status ${res.status}: ${
        res.statusText
      }. Details: ${errorText.substring(0, Math.min(errorText.length, 100))}...`
    ); // Batasi panjang pesan
  }

  // Coba parse JSON
  let data;
  try {
    data = await res.json();
  } catch (jsonParseError) {
    let rawText = ``;
    try {
      rawText = await res.text(); // Ambil teks mentah jika parse JSON gagal
    } catch (readError) {
      console.error(
        `[JSON PARSE ERROR] Failed to read raw response text for ${url}:`,
        readError
      );
    }
    console.error(
      `[JSON PARSE ERROR] Invalid JSON for ${url}:`,
      jsonParseError,
      `Raw response (first 200 chars): ${rawText.substring(
        0,
        Math.min(rawText.length, 200)
      )}...`
    );
    throw new Error(
      `Invalid JSON response from API for ${url}. Please check API response. Raw: ${rawText.substring(
        0,
        Math.min(rawText.length, 100)
      )}...`
    );
  }

  // Periksa format data API spesifik Anda { data: [...] }
  if (!data || !Array.isArray(data.data)) {
    console.error(
      `[API_DATA_FORMAT_ERROR] API did not return expected array in 'data' property for ${url}. Received:`,
      data
    );
    throw new Error(
      "API response format error: expected 'data' property as an array."
    );
  }

  return data.data; // Mengembalikan array data resep
}

// --- Fungsi Fetch Spesifik untuk endpoint resep Anda ---

export async function fetchAllRecipes() {
  return safeJsonFetch("https://v1.appbackend.io/v1/rows/Cob8vdpflXK7", {
    cache: "no-store",
  });
}

export async function fetchFilteredRecipes(searchTerm) {
  const query = searchTerm ? `?nama_resep_like=${searchTerm}` : "";
  return safeJsonFetch(
    `https://v1.appbackend.io/v1/rows/Cob8vdpflXK7${query}`,
    { cache: "no-store" }
  );
}
