export async function readJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  const titleMatch = text.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch?.[1]?.replace(/\s+/g, " ").trim();
  const message = title || text.slice(0, 140) || "The server did not return JSON.";

  throw new Error(
    response.ok
      ? `Expected JSON but received a non-JSON response: ${message}`
      : `Request failed with ${response.status}: ${message}`,
  );
}
