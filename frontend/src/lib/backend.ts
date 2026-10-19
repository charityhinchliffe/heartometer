const backendUrl = process.env.HEARTOMETER_API_URL ?? "http://127.0.0.1:8000";

export async function proxyBackend(path: string, init?: RequestInit) {
  try {
    const response = await fetch(`${backendUrl}${path}`, {
      ...init,
      cache: "no-store",
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return Response.json({ detail: "The classification service is unavailable." }, { status: 502 });
  }
}
