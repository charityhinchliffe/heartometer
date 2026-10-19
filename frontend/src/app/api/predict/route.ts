import { proxyBackend } from "@/lib/backend";

export async function POST(request: Request) {
  return proxyBackend("/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });
}
