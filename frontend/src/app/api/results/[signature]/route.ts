import { proxyBackend } from "@/lib/backend";

export async function GET(_request: Request, context: RouteContext<"/api/results/[signature]">) {
  const { signature } = await context.params;
  return proxyBackend(`/results/${encodeURIComponent(signature)}`);
}
