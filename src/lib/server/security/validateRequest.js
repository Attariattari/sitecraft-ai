import "server-only";

export async function readJson(request, maxBytes = 64 * 1024) {
  const text = await request.text();
  if (text.length > maxBytes) {
    const error = new Error("Request body is too large.");
    error.status = 413;
    throw error;
  }
  return text ? JSON.parse(text) : {};
}

export function requireMethod(request, method) {
  if (request.method !== method) {
    const error = new Error("Method not allowed.");
    error.status = 405;
    throw error;
  }
}
