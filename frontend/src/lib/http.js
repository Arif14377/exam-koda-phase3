const BASE_URL = import.meta.env.VITE_API_URL

async function http({url, body, opts = {}}) {
  // salin headers dari opts.headers. jika tidak ada, buat objek kosong
  const headers = { ...(opts.headers || {}) };

  // Jika token diberikan, sisipkan ke header.Authorization dalam format Bearer (standar JWT).
  if (opts.token) {
    headers.Authorization = `Bearer ${opts.token}`;
  }

  // jika ada body dan belum ada content-type, maka set ke "application/json"
  if (body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // fetch data dari url + endpoint
  const res = await fetch(`${BASE_URL}${url}`, {
    // method → pakai opts.method jika ada, jika tidak ada, maka set: POST kalau ada body, GET kalau tidak ada body.
    method: opts.method || (body ? "POST" : "GET"),
    headers,
    // jika ada body, convert ke json string
    body: body ? JSON.stringify(body) : undefined,
  });

  // parsing response
  // cek content-type, jika application/json, maka parse sebagai objek js, kalau bukan, parse sebagai text
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  // jika status http bukan 200, handle error:
  if (!res.ok) {
    const message =
      typeof data === "object" && data?.message ? data.message : "Request gagal";

    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    
    throw error;
  }

  return data;
}

export default http;