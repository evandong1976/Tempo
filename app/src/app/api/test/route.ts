// app/api/test/route.ts
import { prisma } from "@/lib/prisma";

export async function GET() {
  const now = await prisma.$queryRaw`SELECT NOW() as now`;
  return Response.json({ ok: true, now });
}